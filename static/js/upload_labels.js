//! get coordinates
let result = document.querySelector('.result'),
    img_result = document.querySelector('.img-result'),
    img_w = document.querySelector('.img-w'),
    img_h = document.querySelector('.img-h'),
    options = document.querySelector('.options'),
    cropped = document.querySelector('.cropped'),
    dwn = document.querySelector('.download'),
    upload = document.querySelector('#file-input'),
    cropper = '';

const toastUploadSuccess = document.querySelector('#toastUploadLabel');
const toastUploadFail = document.querySelector('#toastUploadLabelFail');

const timeUpload = document.querySelector('.time_upload');
const toastContentSuccess = document.querySelector('#toast_success_body');

const timeUploadFail = document.querySelector('.time_upload_fail');
const toastContentFail = document.querySelector('#toast_fail_body');

let coorDinates = document.querySelector('.coordinates');
let x, y, w, h;

// const getData = async () => {
//     let data = await axios.get('https://jsonplaceholder.typicode.com/todos/1');
// };

//========================zz===================================================
let imgUploadName = '';
$('.box-2').hide();
upload.addEventListener('change', (e) => {
    $('.box-2').show();
    if (e.target.files.length) {
        const reader = new FileReader();
        reader.onload = (e) => {
            if (e.target.result) {
                let img = document.createElement('img');
                img.id = 'image';
                img.src = e.target.result;
                result.innerHTML = '';
                result.appendChild(img);
                // save.classList.remove('hide');

                cropper = new Cropper(img, {
                    aspectRatio: 0,
                    viewMode: 0,
                    zoomOnWheel: false,
                    crop(event) {
                        const widthImage = event.srcElement.naturalWidth;
                        const heightImage = event.srcElement.naturalHeight;

                        const widthBox = event.detail.width;
                        const hightBox = event.detail.height;

                        const xTopLeft = event.detail.x;
                        const yTopLeft = event.detail.y;

                        x = (+xTopLeft + widthBox / 2) / +widthImage;
                        y = (+yTopLeft + hightBox / 2) / +heightImage;

                        w = widthBox / widthImage;
                        h = hightBox / heightImage;
                    },
                });
            }
        };
        imgUploadName = e.target.files[0].name;
        reader.readAsDataURL(e.target.files[0]);
    }
});

//! end get coordinates

//!util
const getTimePresent = () => {
    let today = new Date();
    let timePresent = today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
    var datePresent = today.getDate() + '/' + (today.getMonth() + 1);
    return { timePresent, datePresent };
};

const toastFail = (message) => {
    const { datePresent, timePresent } = getTimePresent();
    timeUploadFail.innerHTML = timePresent + ' - ' + datePresent;
    toastContentFail.innerHTML = message;
    const toast = new bootstrap.Toast(toastUploadFail);
    toast.show();
};

const toastSuccess = (message) => {
    const { datePresent, timePresent } = getTimePresent();
    timeUpload.innerHTML = timePresent + ' - ' + datePresent;
    toastContentSuccess.innerHTML = message;
    const toast = new bootstrap.Toast(toastUploadSuccess);
    toast.show();
};

//! end util

//! save label into storage
const btnSaveLabel = document.querySelector('#btn_save_label');
const btnSubmitLabel = document.querySelector('.save');
const inputLabel = document.querySelector('#input_label');
const labelPresent = document.querySelector('#label_present');
const btnShowLabel = document.querySelector('#btn_show_label');
const wrapLabelShow = document.querySelector('#label_show');
const tableBody = document.querySelector('#table_body');

labelPresent.innerHTML = localStorage.getItem('label');

btnShowLabel.onclick = (e) => {
    const userNameLogin = document.querySelector('#username_login').innerHTML;

    $.ajax({
        type: 'GET',
        url: `/label/get/${userNameLogin}`,
        dataType: 'json',
        success: function (data) {
            const { data: labelFish, success } = data;
            if (success === 1) {
                const labelSave = JSON.parse(labelFish);
                if (labelSave.length) {
                    const tableContent = labelSave.map(
                        (v, index) =>
                            `
                                <tr class="text-center">
                                    <th scope="row">${index}</th>
                                    <td id="name_label_show"  >${v.name}</td>
                                    <td>${moment(v.created_at.$date).format('DD/MM/YYYY, HH:mm:ss')}
                                    </td>
                                    <td>
                                        <button id="btn_add_data"
                                            style="border: none; background-color: orange ; border-radius: 5px">ADD</button>
                                    </td>
                                </tr>`
                    );
                    tableBody.innerHTML = tableContent.join('');
                    const btnAddData = document.querySelectorAll('#btn_add_data');
                    const nameLabelShow = document.querySelectorAll('#name_label_show');
                    btnAddData.forEach((btn, index) => {
                        btn.onclick = (e) => {
                            let nameFishAdd = nameLabelShow[index].innerHTML;
                            localStorage.setItem('label', nameFishAdd);
                            labelPresent.innerHTML = nameFishAdd;
                            $('#modalShowLabel').modal('hide');
                        };
                    });
                } else {
                    // khong co
                    wrapLabelShow.innerHTML = 'Hi???n b???n ch??a c?? t??n n??o trong h??? th???ng';
                }
            } else {
                // that bai
                wrapLabelShow.innerHTML = 'Hi???n b???n ch??a c?? t??n n??o trong h??? th???ng';
            }
        },
    });

    const handleClickAddData = (e) => {
        console.log(e);
    };
};

btnSaveLabel.onclick = (e) => {
    const userNameLogin = document.querySelector('#username_login').innerHTML;

    const nameFishTrain = localStorage.getItem('label');
    const valueInputLabel = inputLabel.value.replace(/\s/g, '');

    if (inputLabel.value == '') {
        // alert('Vui l??ng nh???p t??n m???i nh???p l??u');
        toastFail('Vui l??ng nh???p t??n m???i nh???p l??u');
        $('#modalSaveName').modal('hide');

        return;
    }

    if (valueInputLabel == nameFishTrain) {
        toastFail('T??n d?? t???n t???i');
        $('#modalSaveName').modal('hide');
        return;
    }

    $.ajax({
        type: 'GET',
        url: `/label/get/${userNameLogin}`,
        dataType: 'json',
        success: function (data) {
            console.log({ data });
            const { data: labelFish, success } = data;
            if (success === 1) {
                const labelSave = JSON.parse(labelFish);
                let exist = false;
                if (labelSave.length > 0) {
                    labelSave.forEach((v) => {
                        if (valueInputLabel == v.name) {
                            toastFail('T??n ???? t???n t???i');
                            $('#modalSaveName').modal('hide');
                            exist = true;
                            return;
                        }
                    });
                    if (!exist) {
                        localStorage.setItem('label', valueInputLabel);
                        labelPresent.innerHTML = valueInputLabel;
                        toastSuccess(
                            'L??u t??n th?? c??ng th??nh c??ng. B??y gi??? b???n c?? th??? t???i d??? li???u h??nh ???nh'
                        );

                        $('#modalSaveName').modal('hide');
                    }
                } else {
                    console.log('2');

                    $('#modalSaveName').modal('hide');
                    toastSuccess(
                        'L??u t??n th?? c??ng th??nh c??ng. B??y gi??? b???n c?? th??? t???i d??? li???u h??nh ???nh'
                    );
                    localStorage.setItem('label', valueInputLabel);
                    labelPresent.innerHTML = valueInputLabel;
                    return;
                }
            } else {
                toastFail('L???i');
                $('#modalSaveName').modal('hide');
            }
        },
    });
};

//! end save label into storage

//! post label

btnSubmitLabel.addEventListener('click', (e) => {
    const labelStorage = localStorage.getItem('label');
    const userNameLogin = document.querySelector('#username_login').innerHTML;

    let check = $('#file-input').val();
    if (check == '') {
        toastFail('Vui l??ng ch???n ???nh v?? khoanh v??ng c?? tr?????c khi l??u d??? li???u');
        return;
    }
    const coordinatesBox = `${x.toFixed(6)} ${y.toFixed(6)} ${w.toFixed(6)} ${h.toFixed(6)}`;

    imgUploadName = imgUploadName.split('.')[0];
    // coorDinates.innerHTML = 0 + ' ' + coordinatesBox;

    var bodyFormData = new FormData($('#upload_file')[0]);

    bodyFormData.append('coordinates', coordinatesBox);
    bodyFormData.append('label', labelStorage);
    bodyFormData.append('image_name', imgUploadName);
    bodyFormData.append('username', userNameLogin);

    // var form_data = new FormData();
    // bodyFormData.append('file', $('#upload_file').prop('files')[0]);

    // if()
    $.ajax({
        type: 'POST',
        url: '/upload/labels',
        data: bodyFormData,
        contentType: false,
        cache: false,
        processData: false,
        success: function (data) {
            console.log({ data });
            if (data == 'FAIL') {
                toastFail('???nh ???? t???n t???i');
            } else {
                $('#file-input').val('');
                $('.box-2').hide();

                const { datePresent, timePresent } = getTimePresent();

                timeUpload.innerHTML = timePresent + ' - ' + datePresent;
                const toast = new bootstrap.Toast(toastUploadSuccess);
                toast.show();
                toastSuccess('T???i d??? li???u th??nh c??ng');
            }
        },
    });
});
//! end post label
const btnComplete = document.querySelector('#btn_complete');
const viewDataPresentForTrain = document.querySelector('#data_present_for_train');
const btnAgreeTrain = document.querySelector('#btn_agree_train');

btnComplete.onclick = (e) => {
    const nameFish = localStorage.getItem('label');
    $.ajax({
        type: 'GET',
        url: `/label/get/data_fish/${nameFish}`,
        dataType: 'json',
        success: function (v) {
            const { data } = v;
            let content = '';
            if (data < 10) {
                content = `Hi???n t???i d??? li???u cho t??n ${nameFish} l?? ${v.data} h??nh. Ch??a ????? ????? hu???n luy???n`;
                $('#btn_agree_train').hide();
            } else {
                content = `Hi???n t???i d??? li???u cho t??n ${nameFish} l?? ${v.data} h??nh`;
                $('#btn_agree_train').show();
            }

            viewDataPresentForTrain.innerHTML = content;
        },
    });
};
