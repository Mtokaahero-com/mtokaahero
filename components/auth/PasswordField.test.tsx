import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { PasswordField } from './PasswordField';

describe('PasswordField', () => {
    it('toggles visibility and shows its error', async () => {
        render(<PasswordField id="pw" label="Password" error="Too short" />);
        const input = screen.getByLabelText('Password');
        expect(input).toHaveAttribute('type', 'password');
        await userEvent.click(screen.getByRole('button', { name: 'Show password' }));
        expect(input).toHaveAttribute('type', 'text');
        expect(screen.getByText('Too short')).toBeInTheDocument();
    });
});
