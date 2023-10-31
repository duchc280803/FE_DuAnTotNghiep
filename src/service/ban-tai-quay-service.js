myApp.service('SelectedInvoiceService', function() {
    var selectedInvoice = {};

    return {
        getSelectedInvoice: function() {
            return selectedInvoice;
        },
        setSelectedInvoice: function(invoice) {
            selectedInvoice = invoice;
        }
    };
});