import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'


describe('Blog Component', () => {
  const blog = {
    author: 'manuel',
    title: 'el ultimo',
    url: 'www.fefr.com',
    likes: 2,
    user: {
      name: 'Rodrigo',
      username: 'rodri',
      id: '65958839cea0f56d4f115bfa'
    },
    id: '659acad12d32567bb78f5e0d'
  }

  test('renders content', () => {
    render(<Blog blog={blog} />)

    const element = screen.getByText('el ultimo manuel')
    expect(element).toBeDefined()

    const notPresentElement = screen.queryByText('www.fefr.com')
    expect(notPresentElement).toBeNull()
  })

  test('shows more when view is clicked', async () => {
    render(<Blog blog={blog} />)

    const user = userEvent.setup()
    const button = screen.getByText('view')

    await user.click(button)

    const url = screen.getByText('www.fefr.com')
    expect(url).toBeDefined()

    const numberOfLikes = screen.getByText('2')
    expect(numberOfLikes).toBeDefined()
  })

  test('like handler is executed when like is pressed', async () => {
    const mockHandler = jest.fn()
    render(<Blog blog={blog} like={mockHandler}/>)

    const user = userEvent.setup()
    const button = screen.getByText('view')

    await user.click(button)

    const likeButton = screen.getByText('like')

    await user.click(likeButton)
    await user.click(likeButton)

    expect(mockHandler.mock.calls).toHaveLength(2)
  })

  test('remove button should not be present if user is notcorrect', async () => {
    window.confirm =  jest.fn()
    const mockHandler = jest.fn()
    render(<Blog blog={blog} remove={mockHandler} loggedUsername='another'/>)

    const user = userEvent.setup()

    const button = screen.getByText('view')
    await user.click(button)

    const notPresentElement = screen.queryByText('remove')
    expect(notPresentElement).toBeNull()
  })

  test('remove handler is executed when remove is pressed only if user is correct', async () => {
    window.confirm =  jest.fn()
    const mockHandler = jest.fn()
    render(<Blog blog={blog} remove={mockHandler} loggedUsername='rodri'/>)

    const user = userEvent.setup()

    const button = screen.getByText('view')
    await user.click(button)

    const removeButton = screen.getByText('remove')

    await user.click(removeButton)

    expect(window.confirm).toHaveBeenCalled()
  })
})
