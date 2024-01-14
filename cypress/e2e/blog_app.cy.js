describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', `${Cypress.env('BACKEND')}/testing/reset`)
    const user = {
      name: 'tester',
      username: 'tester',
      password: '1234'
    }

    const user2 = {
      name: 'teste2',
      username: 'tester2',
      password: '1234'
    }

    cy.request('POST', `${Cypress.env('BACKEND')}/users/`, user) 
    cy.request('POST', `${Cypress.env('BACKEND')}/users/`, user2) 
    cy.visit('')
  })

  it('Login form is shown', function() {
    cy.contains('Log in to application')
  })

  describe('Login',function() {
    it('succeeds with correct credentials', function() {
      cy.get('input[name="Username"').type('tester')
      cy.get('input[name="Password"').type('1234')

      cy.get('#login-button').click()
      cy.contains('tester logged in')
    })

    it('fails with wrong credentials', function() {
      cy.get('input[name="Username"').type('failed')
      cy.get('input[name="Password"').type('sekret')

      cy.get('#login-button').click()

      cy.get('.error')
        .contains('invalid username or password')
        .and('have.css', 'color', 'rgb(255, 0, 0)')
        .and('have.css', 'background-color', 'rgb(254, 174, 174)')
        .and('have.css', 'border', '1px solid rgb(255, 0, 0)')

        cy.get('html').should('not.contain', 'failed logged in')
    })
  })

  describe('When logged in', function() {
    beforeEach(function() {
      cy.login({ username: 'tester', password: '1234' })
    })

    it('A blog can be created', function() {
      cy.contains('new blog').click()

      cy.get('input[name="title"').type('Cy Blog')
      cy.get('input[name="author"').type('Tester')
      cy.get('input[name="url"').type('www.cy.com')

      cy.contains('create').click()

      cy.contains('A new blog Cy Blog by Tester created')

      cy.get('.blogItem')
        .should('contain', 'Cy Blog Tester')
        .and('contain', 'view')
    })

    describe('When a blog is created', function() {
      beforeEach(function() {
        cy.createBlog({title: 'Cy Blog', author: 'Tester', url: 'www.cy.com'})
      })

      it('A blog can be liked', function() {
        cy.contains('view').click()
  
        cy.get('#blog-likes').should('contain', '0')
  
        cy.contains('like').click()
  
        cy.get('#blog-likes').should('contain', '1')
      })
  
      it('A blog can be deleted', function() {
        cy.contains('view').click()

        cy.contains('remove').click()
  
        cy.on('window:confirm', () => true);

        cy.contains('Blog deleted successfully')
      })

      it('only the creator of a Blog can delete it', function() {
        cy.login({ username: 'tester2', password: '1234' })

        cy.contains('view').click()

        cy.get('.blogItem').should('not.contain', 'remove')
      })
    })

    describe('When many blogs are created', function() {
      beforeEach(function() {
        cy.createBlog({title: 'Cy Blog 0', author: 'Tester', url: 'www.cy.com'})
        cy.createBlog({title: 'Cy Blog 1', author: 'Tester', url: 'www.cy.com'})
        cy.createBlog({title: 'Cy Blog 2', author: 'Tester', url: 'www.cy.com'})
      })

      it('are shown by number of likes', function() {

        cy.get('.blogItem').eq(0).should('contain', 'Cy Blog 0 Tester')
        cy.get('.blogItem').eq(1).should('contain', 'Cy Blog 1 Tester')
        cy.get('.blogItem').eq(2).should('contain', 'Cy Blog 2 Tester')

        cy.contains('Cy Blog 2 Tester')
          .contains('view')
          .click()

        cy.contains('like')
          .click()

        cy.get('.blogItem').eq(0).should('contain', 'Cy Blog 2 Tester')
        cy.get('.blogItem').eq(1).should('contain', 'Cy Blog 0 Tester')
        cy.get('.blogItem').eq(2).should('contain', 'Cy Blog 1 Tester')
      })
    })
  })
})