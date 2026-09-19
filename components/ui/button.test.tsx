import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Button } from './button';

describe('Button', () => {
    it('renders the primary variant with the brand color and a 40px height', () => {
        render(<Button>Sign in</Button>);
        const button = screen.getByRole('button', { name: 'Sign in' });
        expect(button.className).toContain('bg-primary');
        expect(button.className).toContain('h-10');
    });

    it('has a rescue variant for SOS actions', () => {
        render(<Button variant="rescue">Guest SOS</Button>);
        expect(screen.getByRole('button', { name: 'Guest SOS' }).className).toContain('bg-rescue');
    });
});
