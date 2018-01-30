var pageNum = 1;
var index = 0;
var dataBox;
var mediaTitle;
var relTime;
var mediaType;
var mediaData;
var dataBoxTop;

if(sessionStorage.manager == undefined ){
	window.location.replace("./../../login.html");
}

function dataList(v){
	switch(v.recommend_type){
		case '0':
			v.recommend_type = '普通文章';
			break;
		case '1':
			v.recommend_type = '次要文章';
			break;
		case '2':
			v.recommend_type = '重要文章';
			break;
	};

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
		+	'<td class="textLeft">'
		+		'<div>'+v.title+'</div>'
		+	'</td>'
		+	'<td>'+v.read_num+'</td>'
		+	'<td>'+v.comments_num+'</td>'
		+	'<td>'+v.praise_num+'</td>'
		+	'<td>'+v.recommend_type+'</td>'
		+	'<td>'+toTime(v.create_date)+'</td>'
		+	'<td>'
		+		'<button type="button" class="btn btn-info btn-xs toHome" toHome-id="'+v.id+'">'+v.recommend_home+'</button>'
		+	'</td>'
		+	'<td>'
		+		'<a href="javascript:;" class="margin-r mediaTop" media-id="'+v.id+'">'+v.top_time+'</a>'
		+		'<a href="javascript:;" class="margin-r recomTop" recommend-id="'+v.id+'">推荐</a>'
		+		'<a class="blue detail" href="#" detail-id="'+v.id+'">详情</a>'
		+		'<a class="pink" href="#" mod-Id="'+v.id+'">'
		+			'<i class="icon-pencil"></i>'
		+		'</a>'
		+		'<a class="red" href="#" del-Id="'+v.id+'">'
		+			'<i class="icon-trash bigger-130"></i>'
		+		'</a>'
		+	'</td>'
		+'</tr>').appendTo('tbody');
};

function mediaGetDate(){
	var relTime = $('#rel-time').val();
	var mediaTitle = $('#media-title').val();
	var mediaType = $('#media-type').val();
	data = {
		page: pageNum,
		createDate: relTime,
		title: mediaTitle,
		recommend_type: mediaType
	}
	$.ajax({
		type:'GET',
		url:IPAdress+'/admin/wemedia/list',
		data:data,
		dataType:'json',
		cache:false,
		success:function(data){
			//console.log(data);
			dataBox = data.data;
			$('tbody').html('');
			$('#pages-box').html('');
			if(dataBox.list == 0){
				$('<tr><td colspan="12">暂无匹配数据</td></tr>').appendTo('tbody');
				return;
			}else{
				index=(dataBox.pageNum-1)*20;
				$.each(dataBox.list,function(i,v){
					index++;
					dataList(v);
				});
				rendPage(dataBox)
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

	mediaGetDate();

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
		mediaGetDate()
	});
	//下一页
	$('#pages-box').on('click','li.next',function(){
		if(nextPage==0){
			pageNum=totalPages;
			return;
		}else{
			pageNum = nextPage;
		}
		mediaGetDate()
	});
	//上一页
	$('#pages-box').on('click','li.prve',function(){
		pageNum = prePage;
		if(pageNum < 1){
			pageNum=1;
			return;
		}else{
			mediaGetDate();
		}
	});

	//单个修改
	$('tbody').on('click','.red',function(){
		var delId=$(this).attr('del-Id');
        layer.confirm('你确定要修改此信息的状态吗？', {
		  	btn: ['确定','取消']
		}, function(){
		  	$.ajax({
		     	type:'DELETE',
		        url:IPAdress+'/admin/wemedia/delete/'+delId,
		        cache:false,
		        dataType:'json',
		        success:function(data){
		         	mediaGetDate();
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
		        url: IPAdress+'/admin/wemedia/deleteByIds/'+ids,
		        cache:false,
		        success:function(data){
		         	mediaGetDate();
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
    	$('#update-wemedia').modal('show');
    	modId = $(this).attr("mod-Id");
    	$.ajax({
    		type:'GET',
			url:IPAdress+'/admin/wemedia/'+modId,
			datype:'json',
			cache:'false',
			success:function(data){
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
			url:IPAdress+'/admin/wemedia/update/'+modId,
			data:$('#updateMediaForm').serialize(),
			dataType:'json',
			success:function(data){
				mediaGetDate();
	         	$('#update-wemedia').modal('hide');
			},
			error:function(data){
			    alert(data.status);
			}
		})
	});

    //查看详情
    $('tbody').on('click','td .detail',function(){
    	$('#post-details').modal('show');
    	var detailId = $(this).attr("detail-id");
    	$.ajax({
    		type:'GET',
			url:IPAdress+'/admin/wemedia/'+detailId,
			datype:'json',
			cache:'false',
			success:function(data){
				//console.log(data);
				switch(data.recommendType){
					case '0':
						data.recommendType = '普通文章';
						break;
					case '1':
						data.recommendType = '次要文章';
						break;
					case '2':
						data.recommendType = '重要文章';
						break;
				};
				$('.media-title').html(data.title);
				$('.createTime').html(toTime(data.createDate));
				$('.createUser').html(data.nickName);
				$('.mediaName').html(data.trueName);
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

    //推荐
    var recommendId = -1;
    $('tbody').on('click','.recomTop',function(){
    	$('#mediaRecommend').modal('show');
    	recommendId = $(this).attr("recommend-id");
    	$("#mediaTop").val('');
    });
    $('#mediaTop').on('change',function(){
		var mediaTopData = $("#mediaTop").val();
		var data = {
			id: recommendId,
			recommendType:mediaTopData
		}
		console.log(recommendId);
		$.ajax({
    		type:'POST',
			url:IPAdress+`/admin/wemedia/recommendArticles`,
			data:data,
			datype:'json',
			cache:'false',
			success:function(data){
				console.log(data)
				if(data.code == '0'){
					$('#mediaRecommend').modal('hide');
			    	mediaGetDate();
				};
				$('#mediaRecommend').modal('hide');
			},
			error:function(data){
			    alert(data.status);
			}
		});
	});

	//置顶
	var mediaId;
	var wemediaTop;
    $('tbody').on('click', 'td .mediaTop',function(){
    	mediaId = $(this).attr("media-id");
    	$.each(dataBoxTop,function(i,v){
			if(v.id == mediaId){
				wemediaTop = v.top_time;
			}
		});
		if(wemediaTop == '置顶'){
			$.ajax({
	    		type:'POST',
				url:IPAdress+'/admin/wemedia/topWemedia/'+mediaId,
				datype:'json',
				cache:'false',
				success:function(data){
					console.log(data);
					if(data.data == 1){
						mediaGetDate();
						layer.msg('置顶成功', {icon: 6});
					}
				},
				error:function(data){
				    alert(data.status);
				}
			});
		}else if(wemediaTop == '取消置顶'){
			$.ajax({
	    		type:'POST',
				url:IPAdress+'/admin/wemedia/cancelWemedia/'+mediaId,
				datype:'json',
				cache:'false',
				success:function(data){
					console.log(data);
					if(data.data == 1){
						mediaGetDate();
						layer.msg('取消成功', {icon: 6});
					}
				},
				error:function(data){
				    alert(data.status);
				}
			});
		};
    });

    //推送
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
				url:IPAdress+'/admin/wemedia/recommendPC/'+toHomeId+'/'+flag,
				datype:'json',
				cache:'false',
				success:function(data){
					console.log(data)
					if(data.code == 0){
						mediaGetDate();
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
				url:IPAdress+'/admin/wemedia/recommendPC/'+toHomeId+'/'+flag,
				datype:'json',
				cache:'false',
				success:function(data){
					console.log(data)
					if(data.code == 0){
						mediaGetDate();
						layer.msg('取消成功', {icon: 6});
					}
				},
				error:function(data){
				    alert(data.status);
				}
			});
    	}
    })

    //查询
    $('#search').on('click',function(){
		mediaGetDate();
    });
    //返回
	$('#backdate').on('click',function(){
		$('#rel-time').val('');
		$('#media-title').val('');
		$('#media-type').val('');
		pageNum = 1;
		mediaGetDate();
	})
})