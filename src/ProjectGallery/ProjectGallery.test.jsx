import { render } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import { describe, it, beforeAll } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { ThemeProvider } from '../contexts/ThemeContext'
import ProjectGallery from './ProjectGallery'

beforeAll(() => {
  global.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
})

describe('ProjectGallery', () => {
  it('renders without throwing', () => {
    render(
      <MemoryRouter initialEntries={['/projects']}>
        <ThemeProvider>
          <ProjectGallery />
        </ThemeProvider>
      </MemoryRouter>
    )
  })
})
