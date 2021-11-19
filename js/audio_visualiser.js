
// player visualiser
const ctx = $.visualisationCanvas.getContext("2d");
$.visualisationCanvas.width = 1075;
$.visualisationCanvas.height = 640;
fillStartCanvas();

function fillStartCanvas() {
    
    let bufferLength = 128

    let x = 0.25;
    let barHeight = 10;
    const barWidth = ($.visualisationCanvas.width / (bufferLength / 2)) - 0.5;

    ctx.fillStyle = "#101010";
    ctx.clearRect(0, 0, $.visualisationCanvas.width, $.visualisationCanvas.height);

    for (let i = 0; i < bufferLength / 2; i++) {
        let r = barHeight + (10 * (i/bufferLength * 2));
        let b = 250 * (i/bufferLength * 2);
        let g = 100;
        
        ctx.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
        ctx.fillRect(x, $.visualisationCanvas.height - barHeight, barWidth, barHeight);
        x += barWidth + 0.5;
    }
}

let isVisualiserCreated = false;


$.createPlayerVisualiser = function() {
    if(!isVisualiserCreated) {  
        isVisualiserCreated = true;

        const audioCtx = new AudioContext();
        let audioSource = audioCtx.createMediaElementSource($.player);
        let analyser = audioCtx.createAnalyser();

        function animateVisualiser() {
            animateName();

            audioSource.connect(analyser);
            analyser.connect(audioCtx.destination);
        
            
            analyser.fftSize = 256;
            const bufferLength = analyser.frequencyBinCount;

            const dataArray = new Uint8Array(bufferLength);
        

            visualisationCanvasCoords = $.visualisationCanvas.getBoundingClientRect();
            $.visualisationCanvas.width = visualisationCanvasCoords.width;
            $.visualisationCanvas.height = visualisationCanvasCoords.height;
            const barWidth = ($.visualisationCanvas.width / (bufferLength / 2)) - 0.5;


            let x = 0.25;
            ctx.fillStyle = "#101010";
            ctx.clearRect(0, 0, $.visualisationCanvas.width, $.visualisationCanvas.height);
            
            analyser.getByteFrequencyData(dataArray);
            let canvasShowHeight = $.visualisationCanvas.height - ($.visualisationCanvas.height / 100 * 20);

            for (let i = 0; i < bufferLength / 2; i++) {
                
                

                let barHeight = dataArray[i] * (canvasShowHeight / 255);
                
                if(barHeight > (canvasShowHeight / 100 * 95)) barHeight -= Math.random() * 10;

                barHeight += 10;
                

                let r = barHeight + (10 * (i/bufferLength * 2));
                let b = 250 * (i/bufferLength * 2);
                let g = 100;
                

                ctx.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
                ctx.fillRect(x, $.visualisationCanvas.height - barHeight, barWidth, barHeight);
                x += barWidth + 0.5;
            }


        requestAnimationFrame(animateVisualiser);
       }

       animateVisualiser();
    }
}


// current name animation
let isCurrentNameAnimating = false;

function animateName() {
    let csnSpan1Width = $.csnSpan1.clientWidth - parseFloat(window.getComputedStyle($.csnSpan1, null).paddingLeft);
    if (csnSpan1Width > $.currentSongNameContainer.clientWidth ) {
        if (!isCurrentNameAnimating) {
            $.csnSpan1.style.animation = `marquee-first-active ${$.currentNameAnimationTime}ms linear`;
            isCurrentNameAnimating = true;
        }
    } else {
        $.cancelAnimateName();
    }
}

$.cancelAnimateName =  function () {
    $.csnSpan1.style.animation = 'none';
    clearTimeout($.timeoutStartCsnSpan1);
    $.csnSpan1.classList.remove('active');
    $.csnSpan1.classList.remove('hidden');

    $.csnSpan2.style.animation = 'none';
    clearTimeout($.timeoutStartCsnSpan2);
    $.csnSpan2.classList.remove('active');
    $.csnSpan2.classList.add('hidden');

    isCurrentNameAnimating = false;
}

$.csnSpan1.addEventListener('animationstart', () => {
    $.timeoutStartCsnSpan2 = setTimeout(() => {
        $.csnSpan2.classList.add('active');
        $.csnSpan2.style.animation = `marquee ${$.currentNameAnimationTime}ms linear`;
        $.csnSpan2.classList.remove('hidden');     
    }, ($.currentNameAnimationTime - 2000))
});

$.csnSpan1.addEventListener('animationend', () => {

    $.csnSpan1.classList.add('hidden');
    $.csnSpan1.classList.remove('active');
    $.csnSpan1.style.animation = 'none';
});

$.csnSpan2.addEventListener('animationstart', () => {
    $.timeoutStartCsnSpan1 = setTimeout(() => {
        $.csnSpan1.classList.add('active');
        $.csnSpan1.style.animation = `marquee ${$.currentNameAnimationTime}ms linear`;
        $.csnSpan1.classList.remove('hidden');      
    }, ($.currentNameAnimationTime - 2000))
});

$.csnSpan2.addEventListener('animationend', () => {
    $.csnSpan2.classList.add('hidden');
    $.csnSpan2.classList.remove('active');
    $.csnSpan2.style.animation = 'none';
});

