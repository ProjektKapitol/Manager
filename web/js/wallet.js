Manager.Wallet = {
    start:function (params) {
        this.container = $(params.container);

        this.view = this.views[params.view];
        this.view.start();

        this.view.wallet = this;

        var obj = this;
    },

    views:{
        default:{
            start: function() {
                var obj = this;

                $(".add-transaction .input").focus(function () {
                    $(this).val('');
                });

                $("#add-transaction-button").click(function () {
                    var desc = $("#add-transaction-description").val();
                    var val = parseFloat($("#add-transaction-value").val()) || 0;
                    //TODO: calculating balance
                    var balance = "X";
                    if (val != 0 && desc.length > 0) {
                        var el = obj.createTransaction({'description': desc , 'value': val, 'balance': balance});
                        $(".transactions").append(el);
                    }
                    return false
                });

                $("#wallet-save").click(function () {
                    //TODO;
                    console.log(this.draft);
                    return false
                });

            },

            update: function(data) {
                this.draft = data;
                var obj = this;
                $.each(this.draft['transactions'], function (k, t) {
                    var el = obj.createTransaction(t);

                    $(".transactions").append(el);

                });
            },

            createTransaction:function (d) {
                var type = d.value > 0 ? "income " : "outcome";

                var el = $('<li class="' + type +'"><span class="description">' + d.description +'</span><span class="balance">' + d.balance +'$</span><span class="value">' + d.value +'$</span></li>');
                el.data('raw', d);
                return el;
            }
        }
    }
}