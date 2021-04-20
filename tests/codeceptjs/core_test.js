/* global Feature Scenario */

var assert = require('assert')

Feature('core')

Scenario('should Disable and enable entire form', async (I) => {
  I.amOnPage('core.html')
  I.seeElement('[data-schemapath="root.name"] input')
  I.seeElement('[data-schemapath="root.age"] input')
  I.click('disable')
  I.seeElement('[data-schemapath="root.age"] input:disabled')
  I.seeElement('[data-schemapath="root.name"] input:disabled')
  I.click('enable')
  I.seeElement('[data-schemapath="root.age"] input:not(:disabled)')
  I.seeElement('[data-schemapath="root.name"] input:not(:disabled)')
})

Scenario('should Disable and enable part of the form', async (I) => {
  I.amOnPage('core.html')
  I.seeElement('[data-schemapath="root.name"] input')
  I.seeElement('[data-schemapath="root.age"] input')
  I.click('disable part')
  I.seeElement('[data-schemapath="root.name"] input:disabled')
  I.click('enable part')
  I.seeElement('[data-schemapath="root.name"] input:not(:disabled)')
})

Scenario('should destroy', async (I) => {
  I.amOnPage('core.html')
  I.seeElement('[data-schemapath="root"]')
  I.click('destroy')
  I.dontSeeElement('[data-schemapath="root"]')
})

Scenario('should set and get form value', async (I) => {
  I.amOnPage('core.html')
  I.click('.get-value')
  assert.equal(await I.grabValueFrom('.value'), '{"age":18,"name":"Francesco Avizzano"}')
  I.click('.set-value')
  I.click('.get-value')
  assert.equal(await I.grabValueFrom('.value'), '{"age":40,"name":"John Smith"}')
})

Scenario('should set and get individual values', async (I) => {
  I.amOnPage('core.html')
  I.click('.get-individual-value')
  assert.equal(await I.grabValueFrom('.value'), '"Francesco Avizzano"')
  I.click('.set-individual-value')
  assert.equal(await I.grabValueFrom('.value'), '"john kaminski"')
})

Scenario('should watch a specific field for changes', async (I) => {
  I.amOnPage('core.html')
  I.dontSeeElement('.name-changed')
  I.click('.set-individual-value')
  I.seeElement('.name-changed')
})

Scenario('should watch form for changes', async (I) => {
  I.amOnPage('core.html')
  I.dontSeeElement('.form-changed')
  I.click('.set-value')
  I.seeElement('.form-changed')
})

Scenario('should change the form if form_name_root option is set @core', async (I) => {
  I.amOnPage('form-name.html')
  I.see('Property must be set.', '.invalid-feedback')
  I.seeElement('[data-schemapath="form_1"]')
  I.seeElement('[data-schemapath="form_2"]')
  I.seeElement('[name="form_1"]')
  I.seeElement('[name="form_2"]')
  I.seeElement('[id="form_1[0]"]')
  I.seeElement('[id="form_1[1]"]')
  I.seeElement('[id="form_1[2]"]')
  I.seeElement('[id="form_2[0]"]')
  I.seeElement('[id="form_2[1]"]')
  I.seeElement('[id="form_2[2]"]')
  I.seeElement('[for="form_1[0]"]')
  I.seeElement('[for="form_1[1]"]')
  I.seeElement('[for="form_1[2]"]')
  I.seeElement('[for="form_2[0]"]')
  I.seeElement('[for="form_2[1]"]')
  I.seeElement('[for="form_2[2]"]')
  I.click('[for="form_1[0]"]')
  I.click('[for="form_2[1]"]')
  I.dontSee('Property must be set.', '.invalid-feedback')
  I.click('#get-value-form-1')
  assert.equal(await I.grabValueFrom('#value-form-1'), '"yes"')
  I.click('#get-value-form-2')
  assert.equal(await I.grabValueFrom('#value-form-2'), '"no"')
})

Scenario('should validate against oneOf schemas and display single oneOf and editors error messages @core @oneof', async (I) => {
  I.amOnPage('oneof.html')
  I.waitForText('Object is missing the required property \'p4\'', '.alert-danger')
  I.waitForText('Value must validate against exactly one of the provided schemas. It currently validates against 0 of the schemas.', '.alert-danger')
  I.waitForText('Object is missing the required property \'p1\'', '.alert-danger')
  I.waitForText('Object is missing the required property \'p2\'', '.alert-danger')
  I.waitForText('Property must be set.', '[data-schemapath="root.p4"] .invalid-feedback')
  I.waitForText('Property must be set.', '[data-schemapath="root.p5.p1"] .invalid-feedback')
  I.waitForText('Property must be set.', '[data-schemapath="root.p5.p2"] .invalid-feedback')
  I.fillField('root[p4]', 'to')
  I.fillField('root[p5][p1]', 'to')
  I.fillField('root[p5][p2]', 'to')
  I.click('Get Value')
  I.wait(3)
  I.dontSee('Object is missing the required property \'p4\'', '.alert-danger')
  I.dontSee('Object is missing the required property \'p1\'', '.alert-danger')
  I.dontSee('Object is missing the required property \'p2\'', '.alert-danger')
  I.waitForText('Value must be at least 4 characters long.', '[data-schemapath="root.p4"] .invalid-feedback')
  I.waitForText('Value must be at least 4 characters long.', '[data-schemapath="root.p5.p1"] .invalid-feedback')
  I.waitForText('Value must be at least 4 characters long.', '[data-schemapath="root.p5.p2"] .invalid-feedback')
  I.fillField('root[p4]', 'todo')
  I.fillField('root[p5][p1]', 'todo')
  I.fillField('root[p5][p2]', 'todo')
  I.click('Get Value')
  I.wait(3)
  I.dontSee('Value must be at least 4 characters long.', '[data-schemapath="root.p4"] .invalid-feedback')
  I.dontSee('Value must be at least 4 characters long.', '[data-schemapath="root.p5.p1"] .invalid-feedback')
  I.dontSee('Value must be at least 4 characters long.', '[data-schemapath="root.p5.p2"] .invalid-feedback')
})

Scenario('should validate against anyOf schemas and display single anyOf and editors error messages @core @anyof', async (I) => {
  I.amOnPage('anyof.html')
  I.dontSeeElement('.alert-danger')
  I.selectOption('.je-switcher', 'Value, number')
  I.dontSeeElement('.alert-danger')
  I.selectOption('.je-switcher', 'Value, null')
  I.dontSeeElement('.alert-danger')
  I.selectOption('.je-switcher', 'Value, string')
  I.waitForText('Object is missing the required property \'age\'', '.alert-danger')
  I.waitForText('Property must be set.', '[data-schemapath="root.age"] .invalid-feedback')
  I.fillField('root[age]', 'to')
  I.click('Get Value')
  I.wait(3)
  I.dontSee('Object is missing the required property \'age\'', '.alert-danger')
  I.dontSee('Property must be set.', '[data-schemapath="root.age"] .invalid-feedback')
})

Scenario('should display anyOf and oneOf error messages in the correct places @848', async (I) => {
  I.amOnPage('issues/issue-gh-848.html')
  I.selectOption('.je-switcher', 'Value, string')
  I.waitForElement('[data-schemapath="root.list"] .invalid-feedback', 5)
  I.dontSeeElement('[data-schemapath="root.list_group"] .invalid-feedback', 5)
})

Scenario('should validate against oneOf schemas and display single oneOf and editors error messages @core @translate-property', async (I) => {
  I.amOnPage('translate-property.html?lang=en')
  I.waitForText('Object Title')
  I.waitForText('Object Description')
  I.waitForText('Boolean Title')
  I.waitForText('Boolean Description')
  I.seeInSource('Boolean Info Text')
  I.waitForText('String Title')
  I.waitForText('String Description')
  I.seeInSource('String Info Text')
  I.waitForText('String Radio Title')
  I.waitForText('String Radio Description')
  I.seeInSource('String Radio Info Text')
  I.waitForText('Integer Title')
  I.waitForText('Integer Description')
  I.seeInSource('Integer Info Text')
  I.waitForText('Number Title')
  I.waitForText('Number Description')
  I.seeInSource('Number Info Text')
  I.waitForText('Array Title')
  I.waitForText('Array Description')
  I.seeInSource('Array Info Text')
  I.waitForText('Array Tabs Title')
  I.waitForText('Array Tabs Description')
  I.seeInSource('Array Tabs Info Text')
  I.waitForText('Array Table Title')
  I.waitForText('Array Table Description')
  I.seeInSource('Array Table Info Text')
  I.waitForText('Signature Title')
  I.waitForText('Signature Description')
  I.seeInSource('Signature Info Text')
  I.waitForText('Rating Title')
  I.waitForText('Rating Description')
  I.seeInSource('Rating Info Text')

  I.amOnPage('translate-property.html?lang=de')
  I.waitForText('Object Title (but in german)')
  I.waitForText('Object Description (but in german)')
  I.waitForText('Boolean Title (but in german)')
  I.waitForText('Boolean Description (but in german)')
  I.seeInSource('Boolean Info Text (but in german)')
  I.waitForText('String Title (but in german)')
  I.waitForText('String Description (but in german)')
  I.seeInSource('String Info Text (but in german)')
  I.waitForText('String Radio Title (but in german)')
  I.waitForText('String Radio Description (but in german)')
  I.seeInSource('String Radio Info Text (but in german)')
  I.waitForText('Integer Title (but in german)')
  I.waitForText('Integer Description (but in german)')
  I.seeInSource('Integer Info Text (but in german)')
  I.waitForText('Number Title (but in german)')
  I.waitForText('Number Description (but in german)')
  I.seeInSource('Number Info Text (but in german)')
  I.waitForText('Array Title (but in german)')
  I.waitForText('Array Description (but in german)')
  I.seeInSource('Array Info Text (but in german)')
  I.waitForText('Array Tabs Title (but in german)')
  I.waitForText('Array Tabs Description (but in german)')
  I.seeInSource('Array Tabs Info Text (but in german)')
  I.waitForText('Array Table Title (but in german)')
  I.waitForText('Array Table Description (but in german)')
  I.seeInSource('Array Table Info Text (but in german)')
  I.waitForText('Signature Title (but in german)')
  I.waitForText('Signature Description (but in german)')
  I.seeInSource('Signature Info Text (but in german)')
  I.waitForText('Rating Title (but in german)')
  I.waitForText('Rating Description (but in german)')
  I.seeInSource('Rating Info Text (but in german)')
})
