import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { PollForm } from './PollForm'

// Mock the onSubmit function
const mockOnSubmit = jest.fn()

describe('PollForm', () => {
  beforeEach(() => {
    mockOnSubmit.mockClear()
  })

  const renderPollForm = (props = {}) => {
    return render(
      <PollForm 
        onSubmit={mockOnSubmit} 
        isLoading={false} 
        {...props} 
      />
    )
  }

  // Unit Tests
  describe('Form Validation', () => {
    it('should display validation errors when title is missing and options are empty', async () => {
      const user = userEvent.setup()
      renderPollForm()

      // Submit form without filling any fields
      await user.click(screen.getByRole('button', { name: /create poll/i }))

      // Check for title validation error
      expect(await screen.findByText(/title is required/i)).toBeInTheDocument()

      // Check for options validation error (at least 2 options required)
      expect(await screen.findByText(/at least 2 options are required/i)).toBeInTheDocument()
    })

    it('should require at least two non-empty options', async () => {
      const user = userEvent.setup()
      renderPollForm()

      // Fill only the title
      await user.type(screen.getByLabelText(/poll title/i), 'Test Poll')
      
      // Fill only one option
      const optionInputs = screen.getAllByPlaceholderText(/option \d+\.\.\./i)
      await user.type(optionInputs[0], 'Option 1')

      // Submit form
      await user.click(screen.getByRole('button', { name: /create poll/i }))

      // Should show validation error for insufficient options
      expect(await screen.findByText(/at least 2 options are required/i)).toBeInTheDocument()
    })

    it('should show error when individual options are empty', async () => {
      const user = userEvent.setup()
      renderPollForm()

      // Fill title
      await user.type(screen.getByLabelText(/poll title/i), 'Test Poll')
      
      // Fill options but leave one empty
      const optionInputs = screen.getAllByPlaceholderText(/option \d+\.\.\./i)
      await user.type(optionInputs[0], 'Option 1')
      await user.type(optionInputs[1], '   ') // Only whitespace

      // Submit form
      await user.click(screen.getByRole('button', { name: /create poll/i }))

      // Should show validation error for empty option
      expect(await screen.findByText(/option cannot be empty/i)).toBeInTheDocument()
    })
  })

  // Integration Test
  describe('Form Submission', () => {
    it('should submit with cleaned data when form is valid and filters empty options', async () => {
      const user = userEvent.setup()
      renderPollForm()

      // Fill title and description
      await user.type(screen.getByLabelText(/poll title/i), 'Favorite Programming Language')
      await user.type(screen.getByLabelText(/description/i), 'What is your preferred language?')

      // Fill the two default options
      const optionInputs = screen.getAllByPlaceholderText(/option \d+\.\.\./i)
      await user.type(optionInputs[0], 'JavaScript')
      await user.type(optionInputs[1], 'Python')

      // Add a third option but leave it empty to test filtering
      await user.click(screen.getByRole('button', { name: /add option/i }))
      
      // Add a fourth option with content
      await user.type(screen.getByPlaceholderText(/option 4\.\.\./i), 'TypeScript')

      // Submit form
      await user.click(screen.getByRole('button', { name: /create poll/i }))

      // Wait for submission
      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledTimes(1)
      })

      // Verify the submitted data is cleaned and correct
      const submittedData = mockOnSubmit.mock.calls[0][0]
      expect(submittedData).toEqual({
        title: 'Favorite Programming Language',
        description: 'What is your preferred language?',
        options: ['JavaScript', 'Python', 'TypeScript'] // Empty option should be filtered out
      })

      // Ensure no empty strings in options
      expect(submittedData.options.every(option => option.trim().length > 0)).toBe(true)
    })

    it('should handle form submission with only required fields', async () => {
      const user = userEvent.setup()
      renderPollForm()

      // Fill only required fields
      await user.type(screen.getByLabelText(/poll title/i), 'Simple Poll')
      
      const optionInputs = screen.getAllByPlaceholderText(/option \d+\.\.\./i)
      await user.type(optionInputs[0], 'Yes')
      await user.type(optionInputs[1], 'No')

      // Submit form
      await user.click(screen.getByRole('button', { name: /create poll/i }))

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledTimes(1)
      })

      const submittedData = mockOnSubmit.mock.calls[0][0]
      expect(submittedData).toEqual({
        title: 'Simple Poll',
        description: '', // Should be empty string when not provided
        options: ['Yes', 'No']
      })
    })
  })

  // Additional Tests for Edge Cases
  describe('Edge Cases', () => {
    it('should disable submit button and show loading state when isLoading is true', () => {
      renderPollForm({ isLoading: true })

      const submitButton = screen.getByRole('button', { name: /creating poll/i })
      expect(submitButton).toBeDisabled()
      expect(submitButton).toHaveTextContent('Creating Poll...')
    })

    it('should allow adding up to 10 options', async () => {
      const user = userEvent.setup()
      renderPollForm()

      // Add 8 more options (starts with 2, so 8 more = 10 total)
      for (let i = 0; i < 8; i++) {
        await user.click(screen.getByRole('button', { name: /add option/i }))
      }

      // Should have 10 option inputs
      const optionInputs = screen.getAllByPlaceholderText(/option \d+\.\.\./i)
      expect(optionInputs).toHaveLength(10)

      // Add option button should be disabled
      const addButton = screen.getByRole('button', { name: /add option/i })
      expect(addButton).toBeDisabled()
    })

    it('should allow removing options when more than 2 exist', async () => {
      const user = userEvent.setup()
      renderPollForm()

      // Add a third option
      await user.click(screen.getByRole('button', { name: /add option/i }))
      
      // Fill the options
      const optionInputs = screen.getAllByPlaceholderText(/option \d+\.\.\./i)
      await user.type(optionInputs[0], 'Option 1')
      await user.type(optionInputs[1], 'Option 2')
      await user.type(optionInputs[2], 'Option 3')

      // Remove the third option
      const removeButtons = screen.getAllByRole('button', { name: /remove option \d+/i })
      await user.click(removeButtons[0]) // Remove first option

      // Should now have 2 options
      const remainingInputs = screen.getAllByPlaceholderText(/option \d+\.\.\./i)
      expect(remainingInputs).toHaveLength(2)
    })

    it('should not allow removing options when only 2 exist', () => {
      renderPollForm()

      // Should not have remove buttons when only 2 options
      const removeButtons = screen.queryAllByRole('button', { name: /remove option \d+/i })
      expect(removeButtons).toHaveLength(0)
    })
  })
})
