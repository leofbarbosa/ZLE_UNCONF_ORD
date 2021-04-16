sap.ui.define([
	"sap/ui/core/format/DateFormat"
], function (DateFormat) {
	"use strict";

	return {

		dateValue: function(oDate) {
			if (!oDate) {
				return "";
			}
			var formatter = DateFormat.getDateTimeInstance({
				pattern: "dd MMM yyyy HH:mm"
			}, sap.ui.getCore().getConfiguration().getLocale());
			return formatter.format(oDate, true);
		}

	};
});