export default class Forms {
    constructor(forms) {
        this.forms = document.querySelectorAll(forms);
        this.inputs = document.querySelectorAll('input');
        this.message = {
            loading: 'Загрузка...',
            success: 'Спасибо! Скоро мы с вами свяжемся',
            failure: 'Что-то пошло не так...'
        };
        this.path = 'assets/question.php';
    }

    clearInputs() {
        this.inputs.forEach(item => {
            item.value = '';
        });
    }

    checkMailInputs() {
        const mailInputs = document.querySelectorAll('[type="email"]');
        mailInputs.forEach(input => {
            input.addEventListener('keypress', (e) => {
                if (e.key.match(/[^a-z 0-9 @ \.]/ig)) {
                    e.preventDefault();
                }
            });
        });
    }

    initMask() {
        let setCursorPosition = (pos, elem) => {
            elem.focus();
            elem.addEventListener('click', () => {
                elem.selectionStart = elem.selectionEnd = elem.value.length;
             });
    
            if (elem.setSelectionRange) {
                elem.setSelectionRange(pos, pos);
            } else if (elem.createTextRange) {
                let range = elem.createTextRange();
    
                range.collapse(true);
                range.moveEnd('charapter', pos);
                range.moveStart('charapter', pos);
                range.select(); 
            }
        };
    
        function createMask(event) {
            let matrix = '+1 (___) ___-____',
                  i = 0,
                  def = matrix.replace(/\D/g, ''),
                  val = this.value.replace(/\D/g, '');
    
            if (def.length >= val.length) {
                val = def;
            }
    
            this.value = matrix.replace(/./g, function(a) {
                return /[_\d]/.test(a) && i < val.length ? val.charAt(i++) : i >= val.length ? '' : a;
            });
    
            if (event.type === 'blur') {
                if (this.value.length === 2) {
                    this.value = '';
                }
            } else {
                setCursorPosition(this.value.length, this);
            }
        }
    
        let inputs = document.querySelectorAll('[name="phone"]');
    
        inputs.forEach(input => {
            input.addEventListener('input', createMask);
            input.addEventListener('focus', createMask);
            input.addEventListener('blur', createMask);
        });
    }

    async postData(url, data) {
        let res = await fetch(url, {
            method: "POST",
            body: data
        });
    
        return await res.text();
    }

    init() {
        this.initMask();
        this.checkMailInputs();
        this.forms.forEach(item => {
            item.addEventListener('submit', (e) => {
                e.preventDefault();

                let statusMessage = document.createElement('div');
                statusMessage.style.ccsText = `
                    margin-top: 15px;
                    font-size: 15px;
                    color: grey;
                `;
                item.parentNode.appendChild(statusMessage);

                statusMessage.textContent = this.message.loading;

                const formData = new FormData(item);

                this.postData(this.path, formData)
                .then(res => {
                    console.log(res);
                    statusMessage.textContent = this.message.success;
                })
                .catch(() => {
                    statusMessage.textContent = this.message.failure;
                })
                .finally(() => {
                    this.clearInputs();
                    setTimeout(() => {
                        statusMessage.remove();
                    }, 5000);
                });
            });
        });
    }
}