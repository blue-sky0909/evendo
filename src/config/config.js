export default {
    key: {
        iosClientId: "350040071867-r74g7udn9m0jdqndt45vgl48j484vqoo.apps.googleusercontent.com",
        webClientId : "350040071867-5lkbcqr669dt14c3a8flhb3eq1lnc3tn.apps.googleusercontent.com"
    },
    endpoints: {
        url: "http://qa-api-account.partybox.com/v1",
        orderUrl: "http://qa-api-checkout.partybox.com/v1",
        partyPlanUrl: "http://qa-api-partyplan.partybox.com/v1",
        login: "/auth/login",
        fbLogin: "/auth/login/facebook",
        fbCreate: "/auth/create/facebook",
        googleCreate: "/auth/create/google",
        googleLogin: "/auth/login/google",
        forgot: "/auth/resetPassword",
        orders: "/orders",
        detailOrder: "/partyplan/order/",
        orderVoucher: "/orders/voucher/validate/",
    }
}