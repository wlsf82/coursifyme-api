describe('API testing using cy.exec()', () => {
  it('GET /courses', () => {
    cy.exec(`curl -H "Authorization: ${Cypress.env('AUTHORIZATION_TOKEN')}" -H "Content-Type: application/json" https://api.coursify.me/v1/courses`)
      .should(({ stdout }) => {
        const obj = JSON.parse(stdout)
        const { data } = obj
        expect(data.length).to.eq(7)
        data.forEach(item => {
          const {
            currency_symbol,
            is_active,
            is_archived
          } = item
          expect(currency_symbol).to.eq('R$')
          expect(is_active).to.eq(true)
          expect(is_archived).to.eq(false)
        })
      })
  })
  
  context('GET /courses/:id', () => {
    it('GET free course', () => {
      cy.exec(`curl -H "Authorization: ${Cypress.env('AUTHORIZATION_TOKEN')}" -H "Content-Type: application/json" https://api.coursify.me/v1/courses/${Cypress.env('FREE_COURSE_ID')}`)
        .should(({ stdout }) => {
          const obj = JSON.parse(stdout)
          const { data } = obj
          expect(data.name).to.eq(Cypress.env('FREE_COURSE_NAME'))
          expect(data.price_type).to.eq('free')
        })
    })

    it('GET paid course', () => {
      cy.exec(`curl -H "Authorization: ${Cypress.env('AUTHORIZATION_TOKEN')}" -H "Content-Type: application/json" https://api.coursify.me/v1/courses/${Cypress.env('PAID_COURSE_ID')}`)
        .should(({ stdout }) => {
          const obj = JSON.parse(stdout)
          const { data } = obj
          expect(data.name).to.eq(Cypress.env('PAID_COURSE_NAME'))
          expect(data.price_type).to.eq('paid')
        })
    })
  })
})
