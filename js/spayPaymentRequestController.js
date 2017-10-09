(function(){
	var sAdapter = window.vAdapters.samsungPay.VisaPaymentAdapter;
	var sAdapterObj = null;

	var _constructor = function(data){
		sAdapterObj = 'paymentInitParams' in data ? new sAdapter(data.paymentInitParams) : null;
	}

	var _getWalletInfoCall = function(data){
		if(sAdapterObj){
			sAdapterObj.getWalletInfo()
			.then(function(res) {
				data.result = res;
				_sendMessage(data);
			})
			.catch(function(err) {
				data.result = res;
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
