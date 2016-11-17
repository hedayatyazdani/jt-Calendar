//create tabs
function TabsCore(){};
TabsCore.infoAlert=0; TabsCore.warningAlert=1; TabsCore.errorAlert=2; TabsCore.alertDelay=7000;
TabsCore.alertDlg=null;
TabsCore.selectedTab=0;
TabsCore.connectionId="";
TabsCore.checkConnectionDelay=30000; //check server each 30 seconds
TabsCore.serverNet=new NetworkTransfer("checkServer.php");
TabsCore.connectImg=null;
TabsCore.activeTab=0;
TabsCore.mainActionList=[];
TabsCore.subActionList=[];
TabsCore.defaultActionList=[];
TabsCore.subActionDialog=null;
TabsCore.direction="left";
TabsCore.mouseX=0;
TabsCore.mouseY=0;
TabsCore.exploreMode=false;
TabsCore.enableAnimation=false;
TabsCore.visibleDoc=true;
TabsCore.lastActionList=null;
TabsCore.popup=null;
TabsCore.buildConsole=false;

TabsCore.leaveMessage="Leave the app?";
TabsCore.showLeaveMessage=false;
TabsCore.reselect=function()
{
	tabWidgetStore[0].goTab(TabsCore.activeTab); selectTab(0);
};
TabsCore.alert=function(message,type)
{
	if(TabsCore.alertDlg)
	{
		dlg=TabsCore.alertDlg;
		img=dlg.img_;
		sp=dlg.sp_;
	}
	else
	{
	dlg=document.createElement("div");
	img=document.createElement("img");
	sp=document.createElement("span");
	dlg.img_=img;
	dlg.sp_=sp;
	dlg.appendChild(img);
	dlg.appendChild(sp);
	TabsCore.alertDlg=dlg;
	}
	sp.innerHTML=message;
	
	switch(type)
	{
		case 0: img.setAttribute("src","res/alert.png"); sp.style.color="white"; break;
		case 1: img.setAttribute("src","res/warning.png"); sp.style.color="white"; break;
		case 2: img.setAttribute("src","res/error.png"); sp.style.color="red"; break;
		default: img.setAttribute("src","res/alert.png"); sp.style.color="white"; break;
	}
	dlg.setAttribute("class","tabsAlert");
	dlg.setAttribute("id","tabsAlertBody");
	document.body.appendChild(dlg);
	setTimeout(TabsCore.closeAlert,TabsCore.alertDelay);
	if (typeof(jtConsole)!="undefined") {
        var cmsg="[m] msg".replace("m",jtConsole.getDate()+" "+jtConsole.getTime()).replace('msg',message);
		try {
            jtConsole.show(cmsg);
        } catch(e) {}
		
    }
};
TabsCore.closeAlert=function()
{
	try{document.body.removeChild(TabsCore.alertDlg);}catch(ex){}
};
TabsCore.prompt=function(msg,title){
	
};
TabsCore.checkServer=function(res)
{
	if(typeof(res)=="undefined")
	{
	n=TabsCore.serverNet;
	n.clear();
	n.target="checkServer.php";
	n.callback=TabsCore.checkServer;
	n.onerror=TabsCore.errorSever;
	n.add("cid",TabsCore.connectionId);
	n.send();
	setTimeout(TabsCore.checkServer,TabsCore.checkConnectionDelay);
	}
	else
	{
		if(parseInt(res)==1)TabsCore.connectImg.setAttribute("src","res/connect.png");
		else TabsCore.connectImg.setAttribute("src","res/disconnect.png");
	}
};
TabsCore.errorSever=function()
{
	TabsCore.connectImg.setAttribute("src","res/disconnect.png");
};
var tabw=null;
TabsCore.start=function() //startTabs
{
	tabw=new TabWidget("tabsArea");
	tabw.build();
	TabsCore.connectImg=document.getElementById("connectImg");
	document.onmousemove=TabsCore.getMousePosition;
}

TabsCore.theme=function(id,theme) //setAreaTheme(id,theme)
{
	var obj=document.getElementById(id);
	obj.setAttribute("class",theme);
}

TabsCore.addTab=function(title,content,active,onclick) //addAction(title,content,active,onclick)
{
	tabw.addTab(title, content, active,onclick);
};

TabsCore.cleanActionKeys=function()
{
	var topb=document.getElementById('mainBarKeys');
	topb.innerHTML="";
	TabsCore.mainActionList.length=0;//clear array
	_("#sidebarKey").value(" ");
};

TabsCore.addMainKey=function(title,action,icon)
{
	if(typeof(icon)=="undefined")icon=null;
	var topb=document.getElementById('mainBarKeys');
	var sideMenu=document.getElementById("sidebarKey");
	var li=document.createElement('li');
	li.innerHTML=title;
	li.setAttribute('onclick',action);
	topb.appendChild(li);
	
	li=document.createElement('li');
	li.innerHTML=title;
	li.setAttribute('onclick',action);
	sideMenu.appendChild(li);
	
	TabsCore.mainActionList.push({"title":title,"action":action,"icon":icon});
};
TabsCore.addDefaultAction=function(title,action,icon)
{
	TabsCore.defaultActionList.push({"title":title,"action":action,"icon":icon});
};
TabsCore.showSubAction=function(evt)
{
	if(Popup.getMouse)Popup.getMouse(evt);
	else
	{
		TabsCore.getMousePosition(evt);
		Popup.mouseX=TabsCore.mouseX;
		Popup.mouseY=TabsCore.mouseY;
	}
	if(TabsCore.popup)Popup.closeAll();
	if(TabsCore.mainActionList.length>0 || TabsCore.defaultActionList.length>0)
	{
		if(TabsCore.mainActionList!=TabsCore.lastActionList)
		{
			var p=new Popup(true);
			//var items=[];
			//var item=null;
			p.items=[];
			for(var i=0;i<TabsCore.mainActionList.length;i++)
			{
				item=new PopupItem(TabsCore.mainActionList[i].title,TabsCore.onpopup);
				//items.push(item);
				p.addItem(item);
			}
			for(var j=0;j<TabsCore.defaultActionList.length;j++)
			{
				if (!TabsCore.hasItem(p,TabsCore.defaultActionList[j].title)) {
                    item=new PopupItem(TabsCore.defaultActionList[j].title,TabsCore.onpopup);
					//items.push(item);
					p.addItem(item);
                }
			}
			//p.items=items;
			p.css="backDialog";
			TabsCore.popup=p;
		}
		if(TabsCore.popup)TabsCore.popup.show();
	}
	return false;
};
TabsCore.hasItem=function(popup,title){
	for(var i=0;i<popup.items.length;i++){
		if (popup.items[i].title.toLowerCase()==title.toLowerCase())return true;
	}
	return false;
};
TabsCore.onpopup=function(item)
{
	eval(TabsCore.mainActionList[item.index].action);
};
TabsCore.hideSubAction=function()
{
	TabsCore.visibleSubAction=false;
	if(TabsCore.subActionDialog)
	{
		TabsCore.subActionDialog.style.visibility="hidden";
	}
};
TabsCore.getMousePosition=function(evt)
{
	TabsCore.mouseX=evt.clientX;
	TabsCore.mouseY=evt.clientY;
}

TabsCore.drawDlg=function(cnt)
{
	var pa=document.getElementById("paintArea");
	if(cnt.toLowerCase)
	{
		pa.innerHTML=cnt;
	}
	else
	{
		pa.appendChild(cnt);
	}
}

TabsCore.showTabsBar=function(vis)
{
	if(TabsCore.visibleDoc==vis)return 0;
	TabsCore.visibleDoc=vis;
	var sb=_("#sideBar").source;
	if(TabsCore.enableAnimation)
	{
		if(document.body.scrollHeight>document.body.offsetHeight)document.body.style.overflow="hidden";
		if(vis)
		{
			sb.setAttribute('class','miniSidebar');
			_('#docBar').a("move-r","0,-142",100,TabsCore.onDocChanged);
		}
		else
		{
			sb.setAttribute('class','largeSidebar');
			_('#docBar').a("move-r","0,142",100,TabsCore.onDocChanged);
		}
	}
	else
	{
		docB=document.getElementById("docBar");
		var bhr=document.getElementById("bottomHr");
		if(vis)
		{
			docB.style.height="170px";
			bhr.style.marginBottom="200px";
			sb.setAttribute('class','miniSidebar');
		}
		else
		{
			docB.style.height="28px";
			bhr.style.marginBottom="50px";
			sb.setAttribute('class','largeSidebar');
		}
	}
}
TabsCore.onDocChanged=function()
{
	if(document.body.scrollHeight>document.body.offsetHeight)document.body.style.overflow="auto";
};

TabsCore.setRTL=function(arg)
{
	if(arg)TabsCore.direction="right";
	var docb=document.getElementById('docBar');
	var topb=document.getElementById('mainBar');
	if(arg)
	{
		docb.style.direction="rtl";
		docb.style.textAlign="right";
		
		topb.style.direction="rtl";
		topb.style.textAlign="right";
		
		lis=topb.getElementsByTagName('li');
		for(i in lis)
		{
			if(lis[i].nodeType==1)
			{
				lis[i].style.cssFloat="right";
				lis[i].style.borderRight="1px solid linen";
				lis[i].style.borderLeft="0px solid linen";
			}
		}
	}
};
TabsCore.switchViewState=function(explore)
{
	if(typeof(explore)=="undefined")TabsCore.exploreMode=!TabsCore.exploreMode;
	else TabsCore.exploreMode=explore;
	if(TabsCore.exploreMode)_("#viewState").source.setAttribute("class","exploreMode noselect");
	else _("#viewState").source.setAttribute("class","compactMode noselect");
};
TabsCore.stopPropagation=function(event,stop_documentClick)
{
	if(event.stopPropagation)event.stopPropagation();
	else event.cancelBubble=true;
};
TabsCore.Console=null;
if (typeof(jtConsole)!="undefined") {
    TabsCore.Console=jtConsole;
};
TabsCore.sidebarVisibility=false;
TabsCore.showSidebar=function(vis){
	if(vis==undefined){
		vis=TabsCore.sidebarVisibility;
		vis=!vis; //toggle
	}
	TabsCore.sidebarVisibility=vis;
	if(vis)_("#sideMenu").removeClass("sidehide");
	else _("#sideMenu").addClass("sidehide");
};


//unload evenet
window.onbeforeunload=function(){if(TabsCore.showLeaveMessage)return TabsCore.leaveMessage; else return null;}