var pageNum = 1;
var index = 0;
var dataBox;
var relTime;
var anonyCont;
var dataBoxTop;

if(sessionStorage.manager == undefined ){
	window.location.replace("./../../login.html");
}

//匿名吐槽列表
function dataList(v){
	if(v.top_time == 0){
		v.top_time = '置顶';
	}else if(v.top_time != 0){
		v.top_time = '取消置顶';
	};


	if(v.recommend_home == 0){
		v.recommend_home = '推至PC首页'
	}else if(v.recommend_home == 1){
		v.recommend_home = '撤至列表'
	}


	$(  '<tr>'
		+	'<td>'
		+		'<label>'
		+			'<input type="checkbox" class="ace" id="every" value="'+v.id+'">'
		+			'<span class="lbl"></span>'
		+		'</label>'
		+    '</td>'
		+	'<td>'+index+'</td>'
		+	'<td class="userNameColor">'+v.nick_name+'</td>'
		+	'<td class="cont" new-id="'+v.id+'">'
		+		'<div>'+v.content+'</div>'
		+	'</td>'
		+	'<td>'+v.read_num+'</td>'
		+	'<td>'+v.praise_num+'</td>'
		+	'<td>'+v.comments_num+'</td>'
		+	'<td>'+toTime(v.create_date)+'</td>'
		+	'<td>'
		+		'<button type="button" class="btn btn-info btn-xs toHome" toHome-id="'+v.id+'">'+v.recommend_home+'</button>'
		+	'</td>'
		+	'<td>'
		+		'<a href="javascript:;" class="anonyTop" anony-id="'+v.id+'">'+v.top_time+'</a>'
		+		'<a class="pink" href="#" mod-Id="'+v.id+'">'
		+			'<i class="icon-pencil"></i>'
		+		'</a>'
		+		'<a class="red" href="#" del-Id="'+v.id+'">'
		+			'<i class="icon-trash bigger-130"></i>'
		+		'</a>'
		+	'</td>'
		+'</tr>').appendTo('tbody');

	//判断状态是否正常
	if(v.status  == 0){
		$('#check_'+index).attr('checked',false);
	}else if(v.status == 1){
		$('#check_'+index).attr('checked',true);
	}
};

//创建数据
function getDate(){

	var relTime = $('#rel-time').val();
	var anonyCont = $('#anony-cont').val();
	var data={
		page:pageNum,
		createDate:relTime,
		content:anonyCont
	}

	$.ajax({
		type:'get',
		url:IPAdress+'/admin/anonymity/list',
		dataType:'json',
		data:data,
		cache:false,
		success:function(data){
			console.log(data);
			dataBox = data.data;
			$('tbody').html('');
			$('#pages-box').html('');
			if(dataBox.list == 0){
				$('<tr><td colspan="10">暂无匹配数据</td></tr>').appendTo('tbody');
				return;
			}else{
				index=(dataBox.pageNum-1)*20;
				$.each(dataBox.list,function(i,v){
					index++;
					dataList(v);
				});
				rendPage(dataBox);
			};
			dataBoxTop = dataBox.list;
		},
		error:function(data){
		    alert(data.status);
		}
	});
};


$(function(){

	str = sessionStorage.manager;
    obj = JSON.parse(str);
    var master = obj.userName;
    //console.log(master)

    $('#master').html(master);

	getDate();

	//点击页码
	$('#pages-box').on('click','li.pageA',function(){
		if($(this).attr('id') == 'active_1'){
			thisNum=1;
		}else if($(this).attr('id') == 'active_'+totalPages){
			thisNum=totalPages;
		}else{
			thisNum = $(this).find('a').text();
		}
		pageNum = thisNum;
		getDate();
	});
	//下一页
	$('#pages-box').on('click','li.next',function(){
		if(nextPage==0){
			pageNum=totalPages;
			return;
		}else{
			pageNum = nextPage;
		}
		getDate();
	});
	//上一页
	$('#pages-box').on('click','li.prve',function(){
		pageNum = prePage;
		if(pageNum < 1){
			pageNum=1;
			return;
		}else{
			getDate();
		}
	});

	//单个删除
	$('tbody').on('click','.red',function(){
		var delId=$(this).attr('del-Id');
        layer.confirm('你确定要删除此信息吗？', {
		  	btn: ['确定','取消']
		}, function(){
		  	$.ajax({
		     	type:'DELETE',
		        url:IPAdress+'/admin/anonymity/delete/'+delId,
		        cache:false,
		        dataType:'json',
		        success:function(data){
		         	getDate();
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
        layer.confirm('你确定要删除所选的信息吗？', {
		  	btn: ['确定','取消']
		}, function(){
		  	$.ajax({
		     	type:'DELETE',
		        url:IPAdress+'/admin/anonymity/deleteByIds/'+ids,
		        cache:false,
		        dataType:'text',
		        success:function(data){
		         	getDate();
		         	layer.msg('删除成功', {icon: 1});
		        },
		        error:function(data){
		        	alert(data.status);
		        }
	     	});
		}, function(){

		});
    });

    //修改
    var modId = -1;
    $('tbody').on('click','.pink',function(){
    	$('#update-anony').modal('show');
    	modId = $(this).attr("mod-Id");
    	$.ajax({
    		type:'GET',
			url:IPAdress+'/admin/anonymity/'+modId,
			datype:'json',
			cache:'false',
			success:function(data){
				 console.log(data);
				$('#createUser').html(data.createUser)
				loadData(data);
			},
			error:function(data){
			    alert(data.status);
			}
    	});
    });
    $('#update').on('click',function(){
		$.ajax({
			type:'POST',
			url:IPAdress+'/admin/anonymity/update/'+modId,
			data:$('#updateAnonyForm').serialize(),
			dataType:'json',
			success:function(data){
				getDate();
	         	$('#update-anony').modal('hide');
			},
			error:function(data){
			    alert(data.status);
			}
		})
	});

    //详情
    $('tbody').on('click','td.cont',function(){
    	$('#post-details').modal('show');
    	var newId = $(this).attr("new-id");
    	$.ajax({
    		type:'GET',
			url:IPAdress+'/admin/anonymity/'+newId,
			datype:'json',
			cache:'false',
			success:function(data){
				console.log(data);
				$('.createTime').html(toTime(data.createDate));
				$('.anonyNick').html(data.nickName);
				$('.yuedu').html(data.readNum);
				$('.dianzan').html(data.praiseNum);
				$('.pinglun').html(data.commentsNum);
				$('.tuijian').html(data.recommendType);
				$('.conts').html(data.content);
			},
			error:function(data){
			    alert(data.status);
			}
		});
    });

    //置顶
    var topTime;
    var anonyId;
    $('tbody').on('click', 'td .anonyTop',function(){
    	anonyId = $(this).attr("anony-id");
    	$.each(dataBoxTop,function(i,v){
			if(v.id == anonyId){
				topTime = v.top_time;
			}
		});
    	if(topTime == '置顶'){
    		$.ajax({
	    		type:'POST',
				url:IPAdress+'/admin/anonymity/top/'+anonyId,
				datype:'json',
				cache:'false',
				success:function(data){
					if(data.data == 1){
						getDate();
						layer.msg('置顶成功', {icon: 6});
					}
				},
				error:function(data){
				    alert(data.status);
				}
			});
    	}else if(topTime == '取消置顶'){
    		$.ajax({
	    		type:'POST',
				url:IPAdress+'/admin/anonymity/cancelAnonymity/'+anonyId,
				datype:'json',
				cache:'false',
				success:function(data){
					if(data.data == 1){
						getDate();
						layer.msg('取消成功', {icon: 6});
					}
				},
				error:function(data){
				    alert(data.status);
				}
			});
    	};
    });

    //推送到PC首页
    var flag = -1;
    var toHomeId;
    var ToHomeText;
    $('tbody').on('click', 'td .toHome',function(){
    	toHomeId = $(this).attr("toHome-id");
    	ToHomeText = $(this).html();
    	if(ToHomeText == '推至PC首页'){
    		flag = 1;
    		$.ajax({
	    		type:'POST',
				url:IPAdress+'/admin/anonymity/recommendPC/'+toHomeId+'/'+flag,
				datype:'json',
				cache:'false',
				success:function(data){
					console.log(data)
					if(data.code == 0){
						getDate();
						layer.msg('推送成功', {icon: 6});
					}
				},
				error:function(data){
				    alert(data.status);
				}
			});
    	}else if(ToHomeText == '撤至列表'){
    		flag = 0;
    		$.ajax({
	    		type:'POST',
				url:IPAdress+'/admin/anonymity/recommendPC/'+toHomeId+'/'+flag,
				datype:'json',
				cache:'false',
				success:function(data){
					console.log(data)
					if(data.code == 0){
						getDate();
						layer.msg('取消成功', {icon: 6});
					}
				},
				error:function(data){
				    alert(data.status);
				}
			});
    	}
    })

    $('#search').on('click',function(){
    	getDate();
    });

    //返回
	$('#backdate').on('click',function(){
		$('#rel-time').val('');
		$('#anony-cont').val('');
		pageNum = 1;
		getDate();
	})
})


