import {
    cn,
    generateId,
    formatDate,
    formatTime,
    truncate,
    generateConversationTitle,
    storage,
} from '@/lib/utils';

describe('cn (className merge)', () => {
    it('merges class names', () => {
        expect(cn('foo', 'bar')).toBe('foo bar');
    });

    it('handles conditional classes', () => {
        expect(cn('foo', true && 'bar', false && 'baz')).toBe('foo bar');
    });

    it('handles tailwind conflicts', () => {
        expect(cn('p-4', 'p-2')).toBe('p-2');
    });

    it('handles undefined and null values', () => {
        expect(cn('foo', undefined, null, 'bar')).toBe('foo bar');
    });

    it('handles empty inputs', () => {
        expect(cn()).toBe('');
    });
});

describe('generateId', () => {
    it('generates unique IDs', () => {
        const id1 = generateId();
        const id2 = generateId();
        expect(id1).not.toBe(id2);
    });

    it('generates string IDs', () => {
        const id = generateId();
        expect(typeof id).toBe('string');
    });

    it('generates IDs with expected format', () => {
        const id = generateId();
        expect(id).toMatch(/^\d+-[a-z0-9]+$/);
    });
});

describe('formatDate', () => {
    beforeEach(() => {
        jest.useFakeTimers();
        jest.setSystemTime(new Date('2024-01-15T12:00:00'));
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    it('returns "Today" for today\'s date', () => {
        const today = new Date('2024-01-15T10:00:00');
        expect(formatDate(today)).toBe('Today');
    });

    it('returns "Yesterday" for yesterday\'s date', () => {
        const yesterday = new Date('2024-01-14T10:00:00');
        expect(formatDate(yesterday)).toBe('Yesterday');
    });

    it('returns "X days ago" for dates within a week', () => {
        const threeDaysAgo = new Date('2024-01-12T10:00:00');
        expect(formatDate(threeDaysAgo)).toBe('3 days ago');
    });

    it('returns formatted date for older dates', () => {
        const oldDate = new Date('2024-01-01T10:00:00');
        expect(formatDate(oldDate)).toBe('Jan 1');
    });

    it('includes year for dates from previous year', () => {
        const lastYear = new Date('2023-12-01T10:00:00');
        expect(formatDate(lastYear)).toMatch(/Dec 1, 2023/);
    });
});

describe('formatTime', () => {
    it('formats morning time correctly', () => {
        const date = new Date('2024-01-15T09:30:00');
        expect(formatTime(date)).toMatch(/9:30\s*AM/i);
    });

    it('formats afternoon time correctly', () => {
        const date = new Date('2024-01-15T14:45:00');
        expect(formatTime(date)).toMatch(/2:45\s*PM/i);
    });

    it('formats midnight correctly', () => {
        const date = new Date('2024-01-15T00:00:00');
        expect(formatTime(date)).toMatch(/12:00\s*AM/i);
    });

    it('formats noon correctly', () => {
        const date = new Date('2024-01-15T12:00:00');
        expect(formatTime(date)).toMatch(/12:00\s*PM/i);
    });
});

describe('truncate', () => {
    it('returns original text if shorter than maxLength', () => {
        expect(truncate('Hello', 10)).toBe('Hello');
    });

    it('truncates text longer than maxLength', () => {
        expect(truncate('Hello, World!', 5)).toBe('Hello...');
    });

    it('handles exact length', () => {
        expect(truncate('Hello', 5)).toBe('Hello');
    });

    it('handles empty string', () => {
        expect(truncate('', 10)).toBe('');
    });

    it('trims whitespace before adding ellipsis', () => {
        expect(truncate('Hello World', 6)).toBe('Hello...');
    });
});

describe('generateConversationTitle', () => {
    it('generates title from content', () => {
        expect(generateConversationTitle('Tell me a joke')).toBe('Tell me a joke');
    });

    it('truncates long content', () => {
        const longContent = 'This is a very long message that should be truncated because it exceeds the maximum length allowed for a title';
        const title = generateConversationTitle(longContent);
        expect(title.endsWith('...')).toBe(true);
        expect(title.length).toBeLessThanOrEqual(53); // 50 + "..."
    });

    it('removes markdown formatting', () => {
        expect(generateConversationTitle('**Bold** text')).toBe('Bold text');
    });

    it('removes markdown links', () => {
        expect(generateConversationTitle('Check [this link](http://example.com)')).toBe('Check this link');
    });

    it('returns default for empty content', () => {
        expect(generateConversationTitle('')).toBe('New Conversation');
    });

    it('returns default for whitespace-only content', () => {
        expect(generateConversationTitle('   ')).toBe('New Conversation');
    });
});

describe('storage', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    describe('get', () => {
        it('returns default value when key does not exist', () => {
            expect(storage.get('nonexistent', 'default')).toBe('default');
        });

        it('returns stored value', () => {
            localStorage.setItem('test', JSON.stringify({ value: 42 }));
            expect(storage.get('test', {})).toEqual({ value: 42 });
        });

        it('returns default value on parse error', () => {
            localStorage.setItem('invalid', 'not-json');
            expect(storage.get('invalid', 'default')).toBe('default');
        });
    });

    describe('set', () => {
        it('stores value in localStorage', () => {
            storage.set('key', { foo: 'bar' });
            expect(JSON.parse(localStorage.getItem('key')!)).toEqual({ foo: 'bar' });
        });

        it('overwrites existing value', () => {
            storage.set('key', 'first');
            storage.set('key', 'second');
            expect(JSON.parse(localStorage.getItem('key')!)).toBe('second');
        });
    });

    describe('remove', () => {
        it('removes item from localStorage', () => {
            localStorage.setItem('key', 'value');
            storage.remove('key');
            expect(localStorage.getItem('key')).toBeNull();
        });

        it('does not throw for nonexistent key', () => {
            expect(() => storage.remove('nonexistent')).not.toThrow();
        });
    });
});
