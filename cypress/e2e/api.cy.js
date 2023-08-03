describe('API testing using cy.exec()', () => {
  const curlBaseCommand = `curl -H "Authorization: ${Cypress.env('AUTHORIZATION_TOKEN')}" -H "Content-Type: application/json" https://api.coursify.me/v1/courses`

  it('GET /courses', () => {
    cy.exec(curlBaseCommand)
      .should(({ stdout }) => {
        const obj = JSON.parse(stdout)
        const { data } = obj
        expect(data.length).to.eq(8)
        data.forEach(item => {
          const {
            currency_symbol,
            is_active,
            is_archived,
            name
          } = item
          expect(currency_symbol).to.eq('R$')
          expect(is_archived).to.eq(false)
          if (name !== 'Boas práticas com Cypress') {
            expect(is_active).to.eq(true)
          } else {
            expect(is_active).to.eq(false)
          }
        })
      })
  })
  
  context('GET /courses/:id', () => {
    it('GET free course', () => {
      cy.exec(`${curlBaseCommand}/${Cypress.env('FREE_COURSE_ID')}`)
        .should(({ stdout }) => {
          const obj = JSON.parse(stdout)
          const { data } = obj
          expect(data.name).to.eq(Cypress.env('FREE_COURSE_NAME'))
          expect(data.price_type).to.eq('free')
        })
    })

    it('GET paid course', () => {
      cy.exec(`${curlBaseCommand}/${Cypress.env('PAID_COURSE_ID')}`)
        .should(({ stdout }) => {
          const obj = JSON.parse(stdout)
          const { data } = obj
          expect(data.name).to.eq(Cypress.env('PAID_COURSE_NAME'))
          expect(data.price_type).to.eq('paid')
        })
    })
  })
})
