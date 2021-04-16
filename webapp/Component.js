sap.ui.define(["sap/suite/ui/generic/template/lib/AppComponent"], function (AppComponent) {
	return AppComponent.extend("com.touchette.unconfirmedorders.Component", {
		metadata: {
			"manifest": "json"
		}
		// init function is not being called: check https://answers.sap.com/questions/666611/sapuigenericappappcomponent-init-not-working.html
		// init: function() {
		// 	AppComponent.prototype.init.apply(this, arguments);
		// 	this.getModel("sourcConfig").setData({
		// 		InventoryVisibility: "N",
		// 		WaiveShippingFlag: false,
		// 		AcceptSaturdayFlag: false
		// 	});
		// }
	});
});