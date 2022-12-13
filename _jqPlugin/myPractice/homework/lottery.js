
// 產生 1 ~ 49 的按鈕--
let numberSelect = $('.number-selector');

for (i = 0; i < 49; i++){
	let newNumBtn = `<button class="number-btn number-${i + 1}">${i + 1}</button>`;
	numberSelect.append(newNumBtn);
}

// 1 ~ 49 數字按鈕增加 click(選數字), dblclick(刪除所選數字) 事件--
// 1. click event--
$('.number-btn').click(function (){
	if (! $(this).hasClass('btn-selected')){
		if ($('.btn-selected').length >= 6){
			// 單擊未選 & 超過 6 個數字: 不選 & 提醒--
			alert("只能選6個數字，點兩下可取消選取的數字");
		} else {
			// 單擊未選 & 不超過 6 個數字: 選擇--
			$(this).addClass('btn-selected');
		}
	}

// 2. dblclick event--
}).dblclick(function (){
	if ($(this).hasClass('btn-selected')){
		// 雙擊已選: 不選--
		$(this).removeClass('btn-selected');
	} 
})

// 產生 num 個不重複數字的 function--
function pickNumbers(num){
	let autoPicks = [];
	let array49 = [...Array(49).keys()]; // [0 ~ 48]
	let numLeft = 49;

	for (i = 0; i < num; i++){
		let ranIdx = Math.floor( Math.random() * numLeft);

		// pick an unrepeated number from 1 to 49--
		autoPicks.push(array49[ranIdx] + 1);

		array49[ranIdx] = array49[array49.length - 1 - i];

		numLeft -=1
	}

	return autoPicks;
}

// 自動選號按鈕新增 click --
$('.auto-pick').click(function (){
	let playerNums = [];

	// clear picks--
	$('.number-btn').removeClass('btn-selected');

	// auto picks--
	playerNums = pickNumbers(6);

	// color picks--
	for (i = 0; i < 6; i++){
		$(`.number-${playerNums[i]}`).addClass('btn-selected');
	}
})

// 開獎按鈕新增 click--
$('.btn-ans').click(function (){

	// check 是否已選 6 個數字--
	if ($('.btn-selected').length < 6){
		alert('需選擇6個數字');
		return
	}
	
	// 清空"開獎結果"--
	$('.final-result1').empty();
	$('.final-result2').empty();

	// 顯示轉圈圈--
	$('.wait-icon').css({
		display: 'block'
	})

	// 開獎期間不能按按鈕--
	$(this).attr('disabled', true);
	$('.auto-pick').attr('disabled', true);
	$('.restart').attr('disabled', true);

	// 產生答案--
	let ansNums = pickNumbers(7);

	// 球動畫--
	let balls = $('.ball'),
    	diameter = balls.height(), // diameter of ball
   		perimeter = Math.PI * diameter, // perimeter of ball
		n = balls.length, // number of balls
        i = 0, // count ball
		itv;  // set&clear interval

	for (let j = 0; j < n; j ++){
		resetBall(j, $(window).width()/2-(diameter*(i)) + 245);
	}

	itv = setInterval(() => {
		if( i >= n){
			clearInterval(itv);
			checkNum(ansNums);
			$(this).attr('disabled', false);
			$('.auto-pick').attr('disabled', false);
			$('.restart').attr('disabled', false);
		} else{
			rotateBall( $(window).width()/2-(diameter*(i)) + 245, ansNums[i] );  // input = distance, 每顆球要走的距離，每球遞減，每球減少一顆球的直徑
			i++;
		}
	},800);

	function rotateBall(distance, num) {
		let degree = distance * 360 / perimeter;  // 每顆球要轉幾圈

		balls.eq(i).css({
			// translate ball--
			transition: "2s cubic-bezier(1.000, 1.450, 0.185, 0.850)",
			transform: 'translateX('+ distance +'px)'
		}).find('.number').css({
			// rotate number on ball--
			transition: "transform 2s cubic-bezier(1.000, 1.450, 0.185, 0.850)",
			transform: 'rotate(' + degree + 'deg)'	
		// put ansNums on the ball--
		}).empty().append(`${num}`);

	}

	function resetBall(idx, distance){
		let ball = balls.eq(idx);
		let degree = distance * 360 / perimeter;  // 每顆球要轉幾圈
		ball.css({
			transition: '',
			transform: 'translateX('+ -distance +'px)'
		}).find('.number').css({
			transition: '',
			transform: 'rotate(' + -degree + 'deg)'	
		})

	}

	function checkNum(ansNums){
		let playerNums = $('.btn-selected').map(function (item) {
			return parseInt(this.innerText);
		});

		playerNums = [...playerNums];

		const WinNormalNums = ansNums.slice(0, 6).filter(item => playerNums.includes(item));

		let NumOfWinNormalNums = WinNormalNums.length;

		const WinSpecialNum = playerNums.includes(ansNums[6]);

		let finalResult = '';
		let resultColor = '#ef233c';
		if (WinSpecialNum){
			switch(NumOfWinNormalNums){
				case 2:
					finalResult = '柒獎';
					break;
				case 3:
					finalResult = '陸獎';
					break;
				case 4:
					finalResult = '肆獎';
					break;
				case 5:
					finalResult = '貳獎';
					break;
				case 6:
					finalResult = '頭獎';
					break;
				default:
					finalResult = '沒得獎';
					resultColor = '#8d99ae';
			}
		} else {
			switch(NumOfWinNormalNums){
				case 3:
					finalResult = '普獎';
					break;
				case 4:
					finalResult = '伍獎';
					break;
				case 5:
					finalResult = '參獎';
					break;
				case 6:
					finalResult = '頭獎';
					break;
				default:
					finalResult = '沒得獎';
					resultColor = '#8d99ae';
			}

		}

		// 關閉轉圈圈--
		$('.wait-icon').css({
			display: ''
		})

		// 顯示結果--
		$('.final-result1').append(`
			一般號中 ${NumOfWinNormalNums}個: ${WinNormalNums.join(', ')}<br>
			特別號中 ${(WinSpecialNum)? 1:0}個: ${(WinSpecialNum)? ansNums[6]:''}`)
		$('.final-result2').append(`${finalResult}`).css({
			color: resultColor,
		})

	}

})

// 重新選號按鈕新增 click--
$('.restart').click(function (){
	$('.number-btn').removeClass('btn-selected');
})


