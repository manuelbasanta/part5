import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CreateBlog from './CreateBlog'


describe('CreateBlog Component', () => {
  test('createBlog function should be called with correct params', async () => {
    const createBlogMock = jest.fn()

    render(<CreateBlog createBlog={createBlogMock} />)
    const user = userEvent.setup()

    const titleInput = screen.getByLabelText('title')
    const authorInput = screen.getByLabelText('author')
    const urlInput = screen.getByLabelText('url')
    const createButton = screen.getByText('create')

    await user.type(titleInput, 'title')
    await user.type(authorInput, 'author')
    await user.type(urlInput, 'url')

    await user.click(createButton)

    expect(createBlogMock.mock.calls).toHaveLength(1)
    expect(createBlogMock.mock.calls[0][0]).toEqual({ title: 'title', author: 'author', url: 'url' })
  })
})