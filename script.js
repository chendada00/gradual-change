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
            // 去除输入中的多余空格和末尾的分号
            input = input.trim().replace(/;$/, '');

            // 处理带有 background: 或 background-image: 前缀的情况
            if (input.startsWith('background:')) {
                input = input.replace('background:', '').trim();
            } else if (input.startsWith('background-image:')) {
                input = input.replace('background-image:', '').trim();
            }

            // 检查是否是合法的渐变格式
            if (!isValidGradient(input)) {
                throw new Error('输入的渐变格式不合法，请检查格式。');
            }

            // 处理 linear-gradient 格式
            if (input.startsWith('linear-gradient')) {
                return input;
            }

            // 处理 -webkit-linear-gradient 格式
            if (input.startsWith('-webkit-linear-gradient')) {
                return convertWebkitGradient(input);
            }

            // 处理 radial-gradient 和 conic-gradient 格式
            if (input.startsWith('radial-gradient') || input.startsWith('conic-gradient')) {
                return input;
            }

            // 处理带有 to right 等方向的渐变
            if (input.includes('to')) {
                return input;
            }

            // 默认处理其他格式，如简单的颜色列表
            const colors = input.split(',').map(c => c.trim());
            if (colors.length < 2) {
                throw new Error('渐变至少需要两个颜色值。');
            }
            return `linear-gradient(${colors.join(', ')})`;
        } catch (error) {
            showErrorMessage(`解析渐变色输入时出错：${error.message}`);
            throw error;
        }
    }

// 检查输入是否是合法的渐变格式
    function isValidGradient(input) {
        const gradientRegex = /^(linear-gradient|radial-gradient|conic-gradient|-webkit-linear-gradient)\(.*\)$/;
        return gradientRegex.test(input) || input.includes('to');
    }

// 将 -webkit-linear-gradient 转换为标准的 linear-gradient
    function convertWebkitGradient(input) {
        const regex = /-webkit-linear-gradient\((.+?)\)/;
        const matches = input.match(regex);
        if (matches && matches.length > 1) {
            const params = matches[1].split(',').map(param => param.trim());
            const angle = params[0];
            const colors = params.slice(1);
            return `linear-gradient(${angle}, ${colors.join(', ')})`;
        } else {
            throw new Error('Invalid -webkit-linear-gradient format');
        }
    }

// 显示错误信息
    function showErrorMessage(message) {
        const errorMessageDiv = document.getElementById('errorMessage');
        errorMessageDiv.textContent = message;
    }

    function clearErrorMessage() {
        const errorMessageDiv = document.getElementById('errorMessage');
        errorMessageDiv.textContent = '';
    }

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
            // const angle = document.getElementById('angleSelect').value; // 获取角度控件的值

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

            const parsedGradient = parseGradientInput(gradientInput);

            // 应用渐变色和角度
            previewDiv.style.background = parsedGradient;
            previewDiv.style.backgroundSize = 'cover';
            previewDiv.style.backgroundRepeat = 'no-repeat';
            previewDiv.style.backgroundImage = `${parsedGradient}, linear-gradient( rgba(255,255,255,0.5), rgba(255,255,255,0.5))`;

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
            showErrorMessage('更新预览时出错，请稍后再试。');
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

            html2canvas(gradientDiv, {
                scale: 2, // 提高图像质量
                transparent: true // 保留元素透明度
            }).then(canvas => {
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
