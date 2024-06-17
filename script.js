document.addEventListener('DOMContentLoaded', function () {
    const errorMessage = document.createElement('div');
    errorMessage.id = 'errorMessage';
    errorMessage.style.color = 'red';
    errorMessage.style.marginTop = '10px';
    document.querySelector('.form-group').appendChild(errorMessage);

    document.getElementById('sizeSelect').addEventListener('change', function () {
        const customSize = document.getElementById('customSize');
        if (this.value === 'custom') {
            customSize.style.display = 'flex';
        } else {
            customSize.style.display = 'none';
        }
        updatePreview();
    });

    document.getElementById('borderRadius').addEventListener('input', function () {
        const value = this.value;
        document.getElementById('borderRadiusValue').textContent = value + '%';
        updatePreview();
    });

    document.getElementById('fontSizeInput').addEventListener('input', updatePreview);
    document.getElementById('fontColorInput').addEventListener('input', updatePreview);
    document.getElementById('letterSpacingInput').addEventListener('input', updatePreview);
    document.getElementById('textInput').addEventListener('input', updatePreview);

    function parseGradientInput(input) {
        try {
            if (input.startsWith('linear-gradient')) {
                return input;
            } else {
                const colors = input.split(',').map(c => c.trim());
                return `linear-gradient(to right, ${colors.join(', ')})`;
            }
        } catch (error) {
            showErrorMessage('解析渐变色输入时出错，请检查输入格式。');
            throw error;
        }
    }

    function showErrorMessage(message) {
        const errorMessageDiv = document.getElementById('errorMessage');
        errorMessageDiv.textContent = message;
    }

    function clearErrorMessage() {
        const errorMessageDiv = document.getElementById('errorMessage');
        errorMessageDiv.textContent = '';
    }

    // 更新预览功能
    function updatePreview() {
        try {
            clearErrorMessage();
            const gradientInput = document.getElementById('gradientInput').value;
            const sizeSelect = document.getElementById('sizeSelect').value;
            const borderRadius = document.getElementById('borderRadius').value;
            const textInput = document.getElementById('textInput').value;
            const fontSize = document.getElementById('fontSizeInput').value;
            const fontColor = document.getElementById('fontColorInput').value;
            const letterSpacing = document.getElementById('letterSpacingInput').value;

            let width, height;

            if (sizeSelect === 'custom') {
                width = document.getElementById('customWidth').value || 800;
                height = document.getElementById('customHeight').value || 600;
            } else {
                [width, height] = sizeSelect.split('x').map(Number);
            }

            const previewDiv = document.getElementById('preview');
            previewDiv.style.width = width + 'px';
            previewDiv.style.height = height + 'px';
            previewDiv.style.borderRadius = Math.min(width, height) * (borderRadius / 100) + 'px';

            const parsedGradient = parseGradientInput(gradientInput); // 解析用户输入的渐变色

            previewDiv.style.background = parsedGradient;
            previewDiv.style.backgroundSize = 'cover';
            previewDiv.style.backgroundRepeat = 'no-repeat';
            previewDiv.style.position = 'relative';
            previewDiv.innerHTML = '';

            if (textInput) {
                const textDiv = document.createElement('div');
                textDiv.textContent = textInput;
                textDiv.style.position = 'absolute';
                textDiv.style.top = '50%';
                textDiv.style.left = '50%';
                textDiv.style.transform = 'translate(-50%, -50%)';
                textDiv.style.fontSize = fontSize + 'px';
                textDiv.style.letterSpacing = letterSpacing + 'px';
                textDiv.style.color = fontColor;
                textDiv.style.textAlign = 'center';
                textDiv.style.width = '100%';
                textDiv.style.whiteSpace = 'nowrap';
                previewDiv.appendChild(textDiv);
            }
        } catch (error) {
            console.error('Error updating preview: ', error);
        }
    }

    document.getElementById('previewBtn').addEventListener('click', updatePreview);

    document.getElementById('generate').addEventListener('click', function () {
        try {
            clearErrorMessage();
            const gradientInput = document.getElementById('gradientInput').value;
            const borderRadius = document.getElementById('borderRadius').value;
            const textInput = document.getElementById('textInput').value;
            const fontSize = document.getElementById('fontSizeInput').value;
            const fontColor = document.getElementById('fontColorInput').value;
            const letterSpacing = document.getElementById('letterSpacingInput').value;

            const sizeSelect = document.getElementById('sizeSelect').value;
            let width, height;
            if (sizeSelect === 'custom') {
                width = document.getElementById('customWidth').value || 800;
                height = document.getElementById('customHeight').value || 600;
            } else {
                [width, height] = sizeSelect.split('x').map(Number);
            }

            const parsedGradient = parseGradientInput(gradientInput);

            const gradientDiv = document.createElement('div');
            gradientDiv.style.width = width + 'px';
            gradientDiv.style.height = height + 'px';
            gradientDiv.style.background = parsedGradient;
            gradientDiv.style.borderRadius = Math.min(width, height) * (borderRadius / 100) + 'px';
            gradientDiv.style.position = 'fixed';
            gradientDiv.style.top = '-9999px';
            gradientDiv.style.left = '-9999px';

            if (textInput) {
                const textDiv = document.createElement('div');
                textDiv.textContent = textInput;
                textDiv.style.position = 'absolute';
                textDiv.style.top = '50%';
                textDiv.style.left = '50%';
                textDiv.style.transform = 'translate(-50%, -50%)';
                textDiv.style.fontSize = fontSize + 'px';
                textDiv.style.letterSpacing = letterSpacing + 'px';
                textDiv.style.color = fontColor;
                textDiv.style.textAlign = 'center';
                textDiv.style.width = '100%';
                textDiv.style.whiteSpace = 'nowrap';
                gradientDiv.appendChild(textDiv);
            }

            document.body.appendChild(gradientDiv);

            html2canvas(gradientDiv).then(canvas => {
                gradientDiv.remove();
                canvas.toBlob(function (blob) {
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.download = 'gradient_image.png';
                    link.href = url;
                    link.click();
                    URL.revokeObjectURL(url);
                });
            }).catch(function(error) {
                showErrorMessage('生成图片时出错，请稍后再试。');
                console.error('Error generating the image: ', error);
            });
        } catch (error) {
            showErrorMessage('解析渐变色输入时出错，请检查输入格式。');
            console.error('Error generating the image: ', error);
        }
    });

    // 初始化时进行一次预览
    updatePreview();

    // 监听控件变化事件，更新预览
    document.getElementById('gradientInput').addEventListener('input', updatePreview);
    document.getElementById('sizeSelect').addEventListener('change', updatePreview);
    document.getElementById('customWidth').addEventListener('input', updatePreview);
    document.getElementById('customHeight').addEventListener('input', updatePreview);
    document.getElementById('borderRadius').addEventListener('input', updatePreview);
});