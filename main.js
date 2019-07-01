!(function () {
  "use strict"
  window.addEventListener('load', function (event) {

    var run = document.getElementById('run')

    // Make start date today.
    var startDate = document.getElementById('start-date')
    startDate.value = new Date().toISOString().split('T')[0]


    // Print Payment Schedule
    run.addEventListener('click', function (event) {
      event.preventDefault()

      var loanAmount = document.getElementById('loan-amount').value
      var interestRate = document.getElementById('interest-rate').value / 100
      var months = document.getElementById('months').value

      var monthlyPayment = document.getElementById('monthly-payment')

      // Calculate Monthly Payment
      var numerator = (interestRate/12) * ( ( 1 + (interestRate/12) ) ** months )
      var denominator = ( ( 1 + (interestRate/12) ) ** months ) - 1
      var payment = loanAmount * ( numerator / denominator )

      monthlyPayment.value = Math.round(payment * 100) / 100

      // Calculate End Date
      var endDate = document.getElementById('end-date')
      var start = new Date(startDate.value)
      endDate.value = new Date(start.setMonth(start.getMonth() + Number(months))).toISOString().split('T')[0]

      // Empty Table
      var table = document.getElementById('table-data')
      table.innerHTML = ''

      // Create Table

      function buildRow (date, rate, remainder) {
        if (Number(remainder) <= 0) return
        var date = new Date(date)
        var d = new Date(date.setMonth(date.getMonth() + 1)).toLocaleDateString('en-us', {month:'long', year:'numeric'})
        var r
        var i = Number( ( remainder || loanAmount ) * interestRate/12 )
        var p = Math.min( remainder, Number( Math.round( (monthlyPayment.value - i) * 100 ) / 100 ) )
        var r = Number( ( remainder || loanAmount ) - p )

        var template = document.createElement('template')
        template.innerHTML = `<tr><td>${d}</td><td>${i.toLocaleString('en-us', {style: 'currency', currency: 'USD'})}</td><td>${p.toLocaleString('en-us', {style: 'currency', currency: 'USD'})}</td><td>${r.toLocaleString('en-us', {style: 'currency', currency: 'USD'})}</td></tr>`
        var clone = document.importNode(template.content, true)

        table.append(clone)

        buildRow(date, i, r)
      }
      buildRow(startDate.value, interestRate, loanAmount)


      // Fill in total interest paid
      totalUpInterest()

    }, false)

    function totalUpInterest () {
      var totalInterest = document.getElementById('total-interest')
    }

  }, false)
}());

