const toastStart = document.getElementById('toastStart');
const toastEnd = document.getElementById('toastEnd');

const timeStartToast = document.querySelector('.time_start_toast');
const timeEndToast = document.querySelector('.time_end_toast');

const toastBodyStart = document.querySelector('.toast-body-start');
const toastBodyEnd = document.querySelector('.toast-body-end');

let text = localStorage.getItem('complete_train');
document.querySelector('.text_complete_train').innerHTML = text;

function makeid() {
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (var i = 0; i < 5; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

const BROKER_URL = 'e9b685676e514fb18a77577bc6449f0c.s1.eu.hivemq.cloud';
const PORT = 8884;
const USER_NAME = 'thanhdai0411';
const PASSWORD = 'thanhdai0411';
var client = new Paho.MQTT.Client(BROKER_URL, PORT, makeid());

client.onConnectionLost = onConnectionLost;
client.onMessageArrived = onMessageArrived;

var options_ = {
    useSSL: true,
    userName: USER_NAME,
    password: PASSWORD,
    onSuccess: onConnect,
    onFailure: doFail,
};

console.log('Waiting Connect to broker....');
client.connect(options_);

function doFail(e) {
    console.log(e);
}

function onConnect() {
    console.log('Connect successful');
    client.subscribe('Train_model');
}

function onConnectionLost(responseObject) {
    if (responseObject.errorCode !== 0) {
        console.log(responseObject.errorMessage);
    }
}

function onMessageArrived(message) {
    console.log('>>>>>>>>>  ' + message.destinationName + ': ' + message.payloadString);

    let stateTrain = message.payloadString;
    let state = stateTrain.split('/')[0];
    let time = stateTrain.split('/')[1];

    if (state == 'Start') {
        timeStartToast.innerHTML = time;
        const toast = new bootstrap.Toast(toastStart);
        toast.show();

        setTimeout(function () {
            location.reload();
        }, 5000);
    }
    if (state == 'End') {
        timeEndToast.innerHTML = time;
        let content = `Ho??n th??nh ?????t t??n cho c?? g???n ????y nh???t v??o l??c ${time}`;
        localStorage.setItem('complete_train', content);

        const toast = new bootstrap.Toast(toastEnd);
        toast.show();
    }
}
// timeEndToast.innerHTML = '01/11/2022 - 20:58';
// const toast = new bootstrap.Toast(toastEnd);
// toast.show();

function public_message(topic, data) {
    var message = new Paho.MQTT.Message(data);

    message.destinationName = topic;
    client.send(message);
}
