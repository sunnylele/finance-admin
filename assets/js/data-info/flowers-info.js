//花名列表数据
function dataThemeInfoList(v){
	$(   '<tr>'
		+	'<td>'
		+		'<label>'
		+			'<input type="checkbox" class="ace" id="every" value="'+v.id+'">'
		+			'<span class="lbl"></span>'
		+		'</label>'
		+    '</td>'
		+	'<td>'+index+'</td>'
		+	'<td>'+v.name+'</td>'
		+	'<td>'
		+		'<img src="'+v.head_pic+'" alt="" width="30" />'
		+	'</td>'
		+	'<td class="cont"><div>'+v.intro+'<div></td>'
		+	'<td>'
		+		'<a class="change" href="#" change-id="'+v.id+'">'
		+			'<i class="icon-pencil"></i>'
		+		'</a>'
		+		'<a class="delete" href="#" data-Id="'+v.id+'" style="margin-left:10px;">'
		+			'<i class="icon-trash bigger-130"></i>'
		+		'</a>'
		+	'</td>'
		+'</tr>').appendTo('.themeInfoList #getThemeInfoList');

	//判断状态是否正常
	if(v.status  == 0){
		// alert(v.status);
		$('#check_'+index).attr('checked',false);
	}else if(v.status == 1){
		// alert(v.status);
		$('#check_'+index).attr('checked',true);
	}
};

//分页信息
function rendPageInfo(dataBox){
    prePage  = dataBox.prePage;
    nextPage = dataBox.nextPage;
    currPage = dataBox.pageNum;

    //第一页默认一直存在
    $(   '<li class="pageA" id="link_1">'
        +   '<a href="javascript:;">1</a>'
        +'</li>').appendTo('.themeInfoList #pages-box1');

    //判断data.pages大于8 创建最后一页
    totalPages = dataBox.pages;
    if( totalPages > 8) {
        //循环navigatepageNums.length，创建分页按钮
        for(var i=1; i< dataBox.navigatepageNums.length-1; i++){
            $(   '<li class="pageA" id="link_'+dataBox.navigatepageNums[i]+'">'
                +   '<a href="javascript:;" >'+dataBox.navigatepageNums[i]+'</a>'
                +'</li>').appendTo('.themeInfoList #pages-box1');
        }
        $(   '<li class="pageA" id="link_'+totalPages+'">'
            +   '<a href="javascript:;">尾页</a>'
            +'</li>').appendTo('.themeInfoList #pages-box1');
    }else{
        //循环navigatepageNums.length，创建分页按钮
        for(var i=1; i< dataBox.navigatepageNums.length; i++){
            $(   '<li class="pageA" id="link_'+dataBox.navigatepageNums[i]+'">'
                +   '<a href="javascript:;" >'+dataBox.navigatepageNums[i]+'</a>'
                +'</li>').appendTo('.themeInfoList #pages-box1');
        }
    }
    var prve = $('<li class="prve"><a href="javascript:;">上一页</a></li>');
    var next = $('<li class="next"><a href="javascript:;">下一页</a></li>');

    $('.themeInfoList #pages-box1').prepend(prve);
    $('.themeInfoList #pages-box1').append(next);
    $('#link_'+currPage).addClass('active');
};

//查看花名
function lookThemeInfo(lookId){
	/*var lookId = $(ev.target).attr("look-id");
	console.log(lookId);*/
	var flowerUser = $('#flower-userInfo').val();
	var data = {
 		page: pageNum,
 		themId: lookId,
 		name: flowerUser
 	}
 	$.ajax({
		type:'GET',
		url:IPAdress+'/admin/themeInfo/list',
		data: data,
		dataType:'json',
		cache:false,
		success:function(data){
			console.log(data.data)
			dataBox = data.data;
			$('.themeInfoList #getThemeInfoList').html('');
			$('.themeInfoList #pages-box1').html('');
			if(dataBox.list == 0){
				$('<tr><td colspan="6">暂无匹配数据</td></tr>').appendTo('.themeInfoList #getThemeInfoList');
				return;
			}else{
				index=(dataBox.pageNum-1)*20;
				$.each(dataBox.list,function(i,v){
					index++;
					dataThemeInfoList(v);
				});
				rendPageInfo(dataBox)
			}
		},
		error:function(data){
		    alert(data.status);
		}
	});
};

$(function(){

	//点击页码
	$('#pages-box1').on('click','li.pageA',function(){
		if($(this).attr('id') == 'link_1'){
			thisNum = 1;
		}else if($(this).attr('id') == 'link_'+totalPages){
			thisNum = totalPages;
		}else{
			thisNum = $(this).find('a').text();
		}
		pageNum = thisNum;
		lookThemeInfo(lookId);
	});
	//下一页
	$('#pages-box1').on('click','li.next',function(){
		if(nextPage == 0){
			pageNum = totalPages;
			return;
		}else{
			pageNum = nextPage;
		}
		lookThemeInfo(lookId);
	});
	//上一页
	$('#pages-box1').on('click','li.prve',function(){
		pageNum = prePage;
		if(pageNum < 1){
			pageNum=1;
			return;
		}else{
			lookThemeInfo(lookId);
		}
	});

	//查看花名
	var lookId = -1;
    $('tbody').on('click','.themeInfo',function(event){
		$('.themeList').hide();
 		$('.themeInfoList').show();
 		lookId = $(this).attr("look-id");
		lookThemeInfo(lookId);

		//添加花名
	    $('#addThemeInfoData').on('click',function(){
			$("#addDate-themeInfo").modal('show');
			$(".modal-body :input").not('input[type = "button" ]').val('');

			$('#upThemeInfoImg').change( function() {
				$('#themeInfoForm').ajaxSubmit({
				    type: 'POST',
				    url: IPAdress+'/upload',
					dataType : 'json',
			        success: function(data) {
			            console.log(data);
			            $('#themeInfoImgSrc').val(data.data.path);
			        }
			    });
				return false;
			});

			$('#addThemeInfo').on('click',function(event){
				$.ajax({
					type:'POST',
					url:IPAdress+'/admin/themeInfo/saveThemeInfo/'+lookId,
					dataType:'json',
		        	data:$('#addThemeInfoForm').serialize(),
					success:function(data){
						$("#addDate-themeInfo").modal('hide');
				 		lookThemeInfo(lookId);
					},
					error:function(data){
					    alert(data.status);
					}
				});
			})
		})
    });
	$('#upThemeInfoImg').on('change',function(){
		selectionImg($(this));
	});


    //单个删除
	$('tbody').on('click','.delete',function(event){
		var Id=$(this).attr("data-Id");
  		layer.confirm('你确定要删除此信息吗？', {
		  	btn: ['确定','取消']
		}, function(){
		  	$.ajax({
		     	type:'DELETE',
		        url:IPAdress+'/admin/themeInfo/delete/'+Id,
		        cache:false,
		        dataType:'json',
		        success:function(data){
		         	lookThemeInfo(lookId);
		         	layer.msg('删除成功', {icon: 1});
		        },
		        error:function(data){
		        	alert(data.status);
		        }
	     	});
		}, function(){

		});
	});

    //批量删除
    $(".del-info").click(function() {
        var ids = getIds();
        if(null == ids || "" == ids || "undefined" == typeof ids) {
            layer.msg("请选择至少一项！",{
            	time: 2000
            });
            return;
        };
        layer.confirm('你确定要删除所选信息吗？', {
		  	btn: ['确定','取消']
		}, function(){
		  	$.ajax({
		     	type:'DELETE',
		        url:IPAdress+'/admin/themeInfo/deleteByIds/'+ids,
		        cache:false,
		        dataType:'text',
		        success:function(data){
		         	lookThemeInfo(lookId);
		         	layer.msg('删除成功', {icon: 1});
		        },
		        error:function(data){
		        	alert(data.status);
		        }
	     	});
		}, function(){

		});
    });

    //修改花名信息
    $('tbody').on('click','.change',function(){
    	$('#update-flowerInfo').modal('show');
    	var changeInfoId = $(this).attr("change-id");
    	$.ajax({
    		type:'GET',
			url:IPAdress+'/admin/themeInfo/'+changeInfoId,
			datype:'json',
			cache:'false',
			success:function(data){
				loadData(data);
			},
			error:function(data){
			    alert(data.status);
			}
    	});
    	$('#updateThemeInfo').on('click',function(){
			$.ajax({
				type:'POST',
				url:IPAdress+'/admin/themeInfo/update/'+changeInfoId,
				data:$('#updateFlowerInfoForm').serialize(),
				dataType:'json',
				success:function(data){
					lookThemeInfo(lookId);
					$('#update-flowerInfo').modal('hide');
				},
				error:function(data){
				    alert(data.status);
				}
			})
		})
    });

    //查询花名
    $('#searchThemeInfo').on('click',function(){
    	 lookThemeInfo(lookId);
    });

    //返回花名列表
    $('#backdateInfo').on('click',function(){
    	$('#flower-userInfo').val('');
    	pageNum = 1;
    	lookThemeInfo(lookId);
    });

    //返回到主题列表
    $('.back-theme').on('click',function(){
    	$('.themeList').show();
     	$('.themeInfoList').hide();
    })
})