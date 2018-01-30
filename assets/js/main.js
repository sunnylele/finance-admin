//var IPAdress = 'http://192.168.0.52:8080';
var IPAdress = 'http://api.5roo.com';


var nextPage ; //下一页页码
var prePage; //上一页页码
var currPage; //当前页码
var totalPages; //总页数


//获取列表id数据
function getIds(){
    var ids = "";
    var objs = $("input[type=checkbox][class='ace']:checked");
    if (0 < objs.length) {
        var i = 0;
        if (objs.eq(i).val() == "on") {
            i++;
        }
        ids += objs.eq(i).val();
        for (i++;i < objs.length;i++) {
            ids += "," + objs.eq(i).val();
        }
    }
    return ids;
}


$(function() {
	//全选
	$("#checkAll").click(function() {
		if(this.checked){
			$('tbody td #every').prop("checked",true);
		}else{
			$('tbody td #every').prop("checked",false);
		}
	});
	//图片放大
	$('tbody').on('click','img.headImg',function(ev){
		$(event.target).next().toggle("slow");
		$(event.target).parents('tr').siblings().find('.zoomImg').fadeOut();
	});
    //角色管理
    $('.check-list h3 input.res').click(function(){
        $('.check-option input.res-every').prop("checked",$(this).prop("checked"));
    });
    $('.check-option h4 input.selectMedia').click(function(){
        $('.check-option ul li input.mediaEvery').prop("checked",$(this).prop("checked"));
    });
    $('.check-option h4 input.selectFlower').click(function(){
        $('.check-option ul li input.flowerEvery').prop("checked",$(this).prop("checked"));
    });
    $('.check-option h4 input.selectFind').click(function(){
        $('.check-option ul li input.findEvery').prop("checked",$(this).prop("checked"));
    });
    $('.check-option h4 input.selectNews').click(function(){
        $('.check-option ul li input.newsEvery').prop("checked",$(this).prop("checked"));
    });
    $('.check-option h4 input.selectNetwork').click(function(){
        $('.check-option ul li input.networkEvery').prop("checked",$(this).prop("checked"));
    });
});


//针对表单进行统一赋值，封装该工具类可以优化代码，提升工作效率
function loadData(obj){
    var key,value,tagName,type,arr;
    for(x in obj){
        key = x;
        value = obj[x];
        $("[name='"+key+"'],[name='"+key+"[]']").each(function(){
            tagName = $(this)[0].tagName;
            type = $(this).attr('type');
            if(tagName=='INPUT'){
                if(type=='radio'){
                    $(this).attr('checked',$(this).val()==value);
                }else if(type=='checkbox'){
                    arr = value.split(',');
                    for(var i =0;i<arr.length;i++){
                        if($(this).val()==arr[i]){
                            $(this).attr('checked',true);
                            break;
                        }
                    }
                }else{
                    $(this).val(value);
                }
            }else if(tagName=='SELECT' || tagName=='TEXTAREA'){
                $(this).val(value);
            }
        });
    }
};


//分页信息
function rendPage(dataBox){
    prePage  = dataBox.prePage;
    nextPage = dataBox.nextPage;
    currPage = dataBox.pageNum;

    //第一页默认一直存在
    $(   '<li class="pageA" id="active_1">'
        +   '<a href="javascript:;">1</a>'
        +'</li>').appendTo('#pages-box');

    //判断data.pages大于8 创建最后一页
    totalPages = dataBox.pages;
    if( totalPages > 8) {
        //循环navigatepageNums.length，创建分页按钮
        for(var i=1; i< dataBox.navigatepageNums.length-1; i++){
            $(   '<li class="pageA" id="active_'+dataBox.navigatepageNums[i]+'">'
                +   '<a href="javascript:;" >'+dataBox.navigatepageNums[i]+'</a>'
                +'</li>').appendTo('#pages-box');
        }
        $(   '<li class="pageA" id="active_'+totalPages+'">'
            +   '<a href="javascript:;">尾页</a>'
            +'</li>').appendTo('#pages-box');
    }else{
        //循环navigatepageNums.length，创建分页按钮
        for(var i=1; i< dataBox.navigatepageNums.length; i++){
            $(   '<li class="pageA" id="active_'+dataBox.navigatepageNums[i]+'">'
                +   '<a href="javascript:;" >'+dataBox.navigatepageNums[i]+'</a>'
                +'</li>').appendTo('#pages-box');
        }
    }
    var prve = $('<li class="prve"><a href="javascript:;">上一页</a></li>');
    var next = $('<li class="next"><a href="javascript:;">下一页</a></li>');

    $('#pages-box').prepend(prve);
    $('#pages-box').append(next);
    $('#active_'+currPage).addClass('active');
};

