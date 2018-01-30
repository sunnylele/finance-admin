

if(sessionStorage.manager == undefined ){
	window.location.replace("login.html");
}

$(function(){

	str = sessionStorage.manager;
    obj = JSON.parse(str);
    var master = obj.userName;
    //console.log(master)

    $('#master').html(master);

    getData();

    //会员注册量统计图
    var dom = document.getElementById('chartUser');
  	var myChart = echarts.init(dom);
  	option = null;
  	option = {
	    title : {
	        text: '会员注册量和待审核人数',
	    },
	    tooltip : {
	        trigger: 'axis'
	    },
	    legend: {
	        data:['注册会员量','待审核人数']
	    },
	    toolbox: {
	        show : true,
	        feature : {
	            dataView : {show: true, readOnly: false},
	            magicType : {show: true, type: ['line', 'bar']},
	            restore : {show: true},
	            saveAsImage : {show: true}
	        }
	    },
	    calculable : true,
	    xAxis : [
	        {
	            type : 'category',
	            data : ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月']
	        }
	    ],
	    yAxis : [
	        {
	            type : 'value'
	        }
	    ],
	    series : [
	        {
	            name:'注册会员量',
	            type:'bar',
	            data:[8.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3],
	            markPoint : {
	                data : [
	                    {type : 'max', name: '最大值'},
	                    {type : 'min', name: '最小值'}
	                ]
	            },
	            markLine : {
	                data : [
	                    {type : 'average', name: '平均值'}
	                ]
	            }
	        },
	        {
	            name:'待审核人数',
	            type:'bar',
	            data:[2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3],
	            markPoint : {
	                data : [
	                    {name : '年最高', value : 182.2, xAxis: 7, yAxis: 183},
	                    {name : '年最低', value : 2.3, xAxis: 11, yAxis: 3}
	                ]
	            },
	            markLine : {
	                data : [
	                    {type : 'average', name : '平均值'}
	                ]
	            }
	        }
	    ]
	};
	myChart.setOption(option);

	//文章统计图
	var article = document.getElementById('chartArticle');
  	var myChart1 = echarts.init(article);
  	option = {
	    title: {
	        text: '文章统计图'
	    },
	    tooltip: {
	        trigger: 'axis'
	    },
	    legend: {
	        data:['匿名吐槽','实名吐槽','有料度']
	    },
	    grid: {
	        left: '3%',
	        right: '4%',
	        bottom: '3%',
	        containLabel: true
	    },
	    toolbox: {
	        feature: {
	            saveAsImage: {}
	        }
	    },
	    xAxis: {
	        type: 'category',
	        boundaryGap: false,
	        data : ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月']
	    },
	    yAxis: {
	        type: 'value'
	    },
	    series: [
	        {
	            name:'匿名吐槽',
	            type:'line',
	            stack: '总量',
	            data:[120, 132, 101, 134, 90, 230, 210, 120, 132, 101, 134, 90]
	        },
	        {
	            name:'实名吐槽',
	            type:'line',
	            stack: '总量',
	            data:[220, 182, 191, 234, 290, 330, 310, 220, 182, 191, 234, 290]
	        },
	        {
	            name:'有料度',
	            type:'line',
	            stack: '总量',
	            data:[820, 932, 901, 934, 1290, 1330, 1320, 820, 932, 901, 934, 1290]
	        }
	    ]
	};
  	myChart1.setOption(option);
});


var pageNum = 1;

//渲染数据
function getData(){
	var data={
		page:pageNum,
	}
	$.ajax({
		type:'POST',
		url:IPAdress+'/admin/main/index',
		data: data,
		dataType:'json',
		cache:false,
		success:function(data){
			console.log(data);
			$('.registerUserNum').html(data.data.registerUser);
			$('.unauditedUser').html(data.data.unauditedUser);
			$('.anonymityNum').html(data.data.anonymityNum);
			$('.dynamicNum').html(data.data.dynamicNum);
			$('.wemeidaNum').html(data.data.wemeidaNum);
			$('.heapNum').html(data.data.heapNum);
			$('.themeNum').html(data.data.themeNum);
			$('.themeInfoNum').html(data.data.themeInfoNum);
			$('.needNum').html(data.data.needNum)
			$('.bankfinanceNum').html(data.data.bankfinanceNum);
		},
		error:function(data){
		    console.log(data.status);
		}
	});
};

    
