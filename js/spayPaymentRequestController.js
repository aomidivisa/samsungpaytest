(function(){
	var sAdapter = window.vAdapters.samsungPay.VisaPaymentAdapter;
	var sAdapterObj = null;

	var _constructor = function(data){
		sAdapterObj = 'paymentInitParams' in data ? new sAdapter(data.paymentInitParams) : null;
	}


	//Create PaymentRequest Object
	var paymentRequest = {
		checkoutPartner: "VisaCheckout",
		requestPayload: {
			data: {
				// checkoutPaymentInfo: checkoutPaymentInfo,
				// visaIntentData: visaData,
				// paymentInitParams: visaConfigs
			}
		}
	};
	var metaProd = "https://ecomm.mpay.samsung.com/ew/v1/vco/w3c";
	var metaStg = "https://ecomm.stg.mpay.samsung.com/ew/v1/vco/w3c";
	var metaJsonUrl =  false ? metaProd : metaStg;
	var methodData = [{
		supportedMethods: [metaJsonUrl],
		data: paymentRequest
	}];
	var details = {
		total: {
			label: "Total due",
			amount: { currency: "USD", value: "00.00" }
		}
	};
	paymentReqWallet = new PaymentRequest(methodData, details, {});



	var _getWalletInfoCall = function(data){


		//console.log("get walletInfo paymentRequest");
	  // console.log(paymentReqWallet);
    // paymentReqWallet.canMakePayment().then(function (result) {
    //   console.log("the response from canMakepayment " + result);
		// 	data.result = { isLinked: result };
		// 	_sendMessage(data);
    // }).catch(function (error) {
    //   console.log("the error from canMakePayment " + error);
		// 	data.result = { isLinked: result };
    //   _sendMessage(data);
    // });


		if(sAdapterObj){
			sAdapterObj.getWalletInfo()
			.then(function(res) {
				data.result = res;
				_sendMessage(data);
			})
			.catch(function(err) {
				data.result = err;
				_sendMessage(data);
			});
		}

	}

	var _sendMessage = function(msg){
		window.parent.postMessage(JSON.stringify(msg),'*');
	}

	var _recieveMessage = function(event) {
		var data = JSON.parse(event.data);
		// console.log('[iframeRecieve]', data);
		switch (data.fn) {
			case 'constructor':
			_constructor(data);
			break;
			case 'getWalletInfo':
			_getWalletInfoCall(data);
			break;
			case 'launchPayApp':
			//TODO call launch app function
			break;
			default:
		}
	}

	if (window.addEventListener) {
		window.addEventListener('message', _recieveMessage, false);
	}else{
		window.attachEvent('onmessage', _recieveMessage);
	}
}())
