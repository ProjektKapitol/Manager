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
                console.log("start");
            },

            update: function() {
                console.log('update');
            }
        }
    }
}