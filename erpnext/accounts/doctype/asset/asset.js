// Copyright (c) 2016, Frappe Technologies Pvt. Ltd. and contributors
// For license information, please see license.txt

frappe.provide("erpnext.asset");

frappe.ui.form.on('Asset', {
	onload: function(frm) {
		frm.set_query("item_code", function() {
			return {
				"filters": {
					"is_stock_item": 0,
					"is_fixed_asset": 1,
					"disabled": 0
				}
			};
		});
	},
	
	refresh: function(frm) {
		if (frm.doc.docstatus==1) {
			if (in_list(["Submittted", "Partially Depreciated", "Fully Depreciated"], frm.doc.status)) {
				cur_frm.add_custom_button("Scrap Asset", function() {
					erpnext.asset.scrap_asset(frm);
				});
			} else if (frm.doc.status=='Scrapped') {
				cur_frm.add_custom_button("Restore Asset", function() {
					erpnext.asset.restore_asset(frm);
				});
			}
		}
	}
});

erpnext.asset.scrap_asset = function(frm) {
	frappe.confirm(__("Do you really want to scrap this asset?"), function () {
		frappe.call({
			args: {
				"asset_name": frm.doc.name
			},
			method: "erpnext.accounts.doctype.asset.depreciation.scrap_asset",
			callback: function(r) {
				cur_frm.reload_doc();
			}
		})
	})
}

erpnext.asset.restore_asset = function(frm) {
	frappe.confirm(__("Do you really want to restore this scrapped asset?"), function () {
		frappe.call({
			args: {
				"asset_name": frm.doc.name
			},
			method: "erpnext.accounts.doctype.asset.depreciation.restore_asset",
			callback: function(r) {
				cur_frm.reload_doc();
			}
		})
	})
}