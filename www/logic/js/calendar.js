function Task(uid,title,color,start,end,fstart,fend,fpercent,explain,data,repeat,project,option,index,id)
{
	
	this.id=null;
	this.index=null;
	this.title=null;
	this.color=null;
	this.start=null;
	this.end=null;
	this.uid=null;
	this.explain=null;
	this.data=null;
	this.repeat=null;
	this.project=null;
	this.failureStart=null;
	this.failureEnd=null;
	this.failureTimePercent=10;
	this.option=null;
var defMoment=Moment.fconvert(Calendar.activeObject.moment,CalSetting.calType);
this.id=id?parseInt(id):0; this.index=index?index:0; this.title=title?title:''; this.color=color?color:"ffff00"; this.start=start?start:defMoment;
this.end=end?end:defMoment; this.uid=uid?uid:"me";this.explain=explain?explain:""; this.data=data?data:""; this.repeat=repeat?repeat:0;
this.project=project?project:0; this.failureStart=fstart?fstart:defMoment; this.failureEnd=fend?fend:defMoment;
this.failureTimePercent=fpercent?fpercent:0; this.option=option?option:0; this.failureTimePercent=0;
};



Task.table='task';
Task.loadingCalendar=null;
Task.loadList=null;
Task.helperFuse=0;


Task.save=function(o)
{
	if(!LU.net)LU.net=new NetworkTransfer();
	var n=LU.net;
	n.clear();
	n.method="POST";
	n.target="client/Task/save/";
	n.add("xml",Task.toXml(o),true);
	n.callback=LU.globalCallback?LU.globalCallback:null;
	n.onerror=null;
	n.send();
};
Task.search=function(uid,param,start,end,dl,ul)
{
	if(!LU.net)LU.net=new NetworkTransfer();
	var n=LU.net;
	n.clear();
	n.target="client/Task/search/";
	if(param)n.add("param",param,true);
	if(start instanceof Moment)start=Moment.getStamp(start);
	if(end instanceof Moment)end=Moment.getStamp(end);
	if(start)n.add("start",start,true);
	if(end)n.add("end",end,true);
	if(dl>=0){
	    n.add('dl',dl);
	    n.add('ul',ul);
	}
	n.callback=LU.globalCallback?LU.globalCallback:null;
	n.onerror=null;
	n.send();
};
Task.remove=function(o)
{
	if(!LU.net)LU.net=new NetworkTransfer();
	var n=LU.net;
	n.clear();
	n.target="client/Task/remove/";
	if(typeof(o)=="object"){
	    n.add("id",o.id);
	    if(o.dialog){
	        o.dialog.parentElement.removeChild(o.dialog);
	    }
	}
	else n.add("id",o);
	//n.add("xml",Task.toXml(o));
	n.callback=LU.globalCallback?LU.globalCallback:null;
	n.onerror=null;
	n.send();
};
Task.toXml=function(o)
{
	if(o instanceof Array)
	{
		var ret="";
		for(var i=0;i<o.length;i++)
		{
			if(o[i])ret+=Task.toXml(o[i]);
		}
		return ret;
	}
	else
	{
		return "<Task id=\""+o.id+"\" index=\""+o.index+"\" title=\""+o.title+"\" color=\""+o.color+"\" start=\""+Moment.getStamp(o.start)+"\" end=\""+Moment.getStamp(o.end)+"\" uid=\""+o.uid+"\" data=\""+o.data+"\" repeat=\""+o.repeat+"\" project=\""+o.project+"\" failureStart=\""+Moment.getStamp(o.failureStart)+"\" failureEnd=\""+Moment.getStamp(o.failureEnd)+"\" failureTimePercent=\""+o.failureTimePercent+"\" option=\""+o.option+"\">"+o.explain+"</Task>";
	}
};
Task.parseXml=function(arg)
{
	if(typeof(arg)=="string")
	{
		if(window.DOMParser)
		{
			var parser=new DOMParser();
			var doc=parser.parseFromString(arg,"text/xml");
		}
		else if(Window.ActiveXObject)
		{
			var doc=new ActiveXObject("Microsoft.DOMXML");
		}
		else return;
		
		var ret=[];
		var items=doc.getElementsByTagName('Task');
		for(var i=0;i<items.length;i++)
		{
			ret.push(new Task.parseXml(items[i]))
		}
		return ret;
	}
	else
	{
	    var explain="";
	    for(var i=0;i<arg.childNodes.length;i++){
	        if(arg.childNodes[i].nodeType==3){
	            if(explain)explain+="\r\n";
	            explain+=arg.childNodes[i].nodeValue;
	        }
	    }
	    var start=Moment.parseStamp(arg.getAttribute("start"));
	    var end=Moment.parseStamp(arg.getAttribute("end"));
	    var fstart=Moment.parseStamp(arg.getAttribute("failureStart"));
	    var fend=Moment.parseStamp(arg.getAttribute("failureEnd"));
	    start.calendar=end.calendar=fstart.calendar=fend.calendar=1;
	    
		return new Task(arg.getAttribute("uid"),arg.getAttribute("title"),arg.getAttribute("color"),start,end,fstart,fend,
	    	arg.getAttribute("failureTimePercent"),explain,arg.getAttribute("data"),arg.getAttribute("repeat"),arg.getAttribute("project"),
	    	arg.getAttribute("option"),arg.getAttribute("index"),arg.getAttribute("id"));
	}
};
Task.buildForm=function(o,view,par)
{
	Task.activeObject=o;
	o.dialog= Jet.App.buildForm(o,view,par);
	o.dialog.lObj=o;
	return o.dialog;
};
Task.config=function()
{
	Jet.App.register("Task",Task);
	Jet.App.form.Task={};
	Jet.App.form.Task[1]="<table class=\"infobox\"><tr><td>%title-lbl%</td><td><input type=\"text\" id=\"titleTxb\" value=\"%title%\"/></td></tr><tr><td>%index-lbl%</td><td><input type=\"number\" id=\"indexTxb\" value=\"%index%\"/></td></tr><tr><td>%color-lbl%</td><td><input type=\"color\" id=\"colorTxb\" value=\"%color%\"/></td></tr><tr><td>%explain-lbl%</td><td><textarea id=\"explainTxb\">%explain%</textarea></td></tr><tr><td>%repeat-lbl%</td><td id=\"repeatPan\"></td></tr><tr><td>%failurePercent-lbl%</td><td><input type=\"number\" id=\"ftTxb\" value=\"%failurTimePercent%\"/></td></tr></table><table><tr><td id=\"startLbl\">%start-lbl%</td> <td id=\"endLbl\">%end-lbl%</td></tr><tr><td id=\"startPan\"></td> <td id=\"endPan\"></td></tr><tr><td>&nbsp;</td> <td></td></tr><tr><td id=\"fstartLbl\">%failureStart-lbl%</td> <td id=\"fendLbl\">%failureEnd-lbl%</td></tr><tr><td id=\"fstartPan\"></td> <td id=\"fendPan\"></td></tr><tr><td></td><td></td></tr></table><hr style=\"clear:both\"/><center><button onclick=\"Task.onSave()\" class=\"green btn\">%save-lbl%</button></center>";
	Jet.App.form.Task[2]="<span style=\"background-color:%color%\" class=\"taskView2\" title=\"%explain%\">%title% <span><button onclick=\"LU.clear();Task.buildForm(Task.loadList[%id%],1,LU.painterArea);\" class=\"green btn\">%edit-lbl%</button> <button onclick=\"Task.remove(Task.loadList[%id%]);\" class=\"red btn\">%remove-lbl%</button></span></span>";
	Jet.App.form.Task[3]="";
	
	JetApp.form["Task1par"]="div";
	JetApp.form["Task1cssClass"]="taskEdit";
	JetApp.form["Task2par"]="span";
	
	Jet.App.form.Task.userButton="";
	
	Jet.App.form.Task.ownerButton=Jet.App.form.Task.userButton+
	"";
};
Task.bind=function(o,ctrl,view)
{
	try{
	    if(view==1 ||view == 3){
	        ctrl.startUI=new MomentUI("",true,true,true,false,Moment.fconvert(o.start,CalSetting.calType));
	        ctrl.endUI=new MomentUI("",true,true,true,false,Moment.fconvert(o.end,CalSetting.calType));
	        ctrl.fstartUI=new MomentUI("",true,true,true,false,Moment.fconvert(o.failureStart,CalSetting.calType));
	        ctrl.fendUI=new MomentUI("",true,true,true,false,Moment.fconvert(o.failureEnd,CalSetting.calType));
	        
	        ctrl.startUI.buildForm(document.getElementById("startPan"));
	        ctrl.endUI.buildForm(document.getElementById("endPan"));
	        ctrl.fstartUI.buildForm(document.getElementById("fstartPan"));
	        ctrl.fendUI.buildForm(document.getElementById("fendPan"));
	    }
	    else if(view==2){
	        ctrl.style.color=LU.contrastColor(o.color);
	    }
	    Task.getRepeatCmb(o.repeat,"repeatPan");
	    
	    switch(Task.helperFuse){
	    	case 1:
	    		ctrl.endUI.dlg.parentElement.innerHTML="";
	    		ctrl.fstartUI.dlg.parentElement.innerHTML="";
	    		ctrl.fendUI.dlg.parentElement.innerHTML="";
	    		_("#endLbl").value(" ");
	    		_("#fstartLbl").value(" ");
	    		_("#fendLbl").value(" ");
	    		break;
	    	case 2:
	    		ctrl.fstartUI.dlg.parentElement.innerHTML="";
	    		ctrl.fendUI.dlg.parentElement.innerHTML="";
	    		_("#fstartLbl").value(" ");
	    		_("#fendLbl").value(" ");
	    		break;
	    	default:
	    		break;
	    }
	}
	catch(ex){}
	
};
Task.getRepeatCmb=function(selected,par,id)
{
	if(!id)id="repeatCmb";
	var cmb=document.createElement("select");
	cmb.setAttribute('id',id);
	var keys=Object.keys(taskRepeats);
	var opt=null;
	for(var i=0;i<keys.length;i++){
	    opt=document.createElement('option');
	    opt.setAttribute("value",keys[i]);
	    opt.innerHTML=taskRepeats[keys[i]];
	    cmb.appendChild(opt);
	}
	
	if(typeof(par)=="string")par=document.getElementById(par);
	par.appendChild(cmb);
};
Task.onSave=function()
{
	var t=Task.activeObject;
	t.title=_("#titleTxb").value();
	t.index=_("#indexTxb").value();
	t.color=_("#colorTxb").value();
	t.explain=_("#explainTxb").value();
	t.repeat=_("#repeatCmb").value();
	t.failureTimePercent=_("#ftTxb").value();
	t.start=Moment.fconvert(t.dialog.startUI.value(),Moment.gregorian);
	switch(Task.helperFuse){
		case 1:
			t.end=t.start;
			t.failureStart=t.start;
			t.failureEnd=t.start;
			break;
		case 2:
			t.end=Moment.fconvert(t.dialog.endUI.value(),Moment.gregorian);
			t.failureStart=t.start;
			t.failureEnd=t.end;
			break;
		default:
			t.end=Moment.fconvert(t.dialog.endUI.value(),Moment.gregorian);
			t.failureStart=Moment.fconvert(t.dialog.fstartUI.value(),Moment.gregorian);
			t.failureEnd=Moment.fconvert(t.dialog.fendUI.value(),Moment.gregorian);
			break;
	}
	
	LU.activeObject=t;
	LU.globalCallback=LU.save;
	Task.save(t);
};
Task.load=function(cal)
{
	Task.loadingCalendar=cal;
	LU.globalCallback=Task.loadBack;
	Task.search(null,"",
	    cal.dayList[0].getMoment(Moment.gregorian),
	    cal.dayList[cal.dayList.length-1].getMoment(Moment.gregorian)
	    );
};
Task.loadBack=function(res)
{
	var tasks=Task.parseXml(res);
	Task.loadList={};
	for(var i=0;i<tasks.length;i++){
	    Task.setToDays(Task.loadingCalendar,tasks[i]);
	    Task.loadList[tasks[i].id]=tasks[i];
	}
	LU.globalCallback=null;
};
Task.setToDays=function(cal,task)
{
	for(var i=0;i<cal.dayList.length;i++){
	    m=cal.dayList[i].getMoment(Moment.gregorian);
	    if(Moment.compare(m,task.start)>=0 && Moment.compare(m,task.end)<=0){
	        cal.dayList[i].tasks.push(task);
	    if(cal.dayList[i].dialog){
	        //show on the dialog
	    }
	    }
	}
};

function Aniversary(owner,cal,option,title,explain,loc,_date,id)
{
	
	this.calendar=null;
	this.option=null;
	this.title=null;
	this.explain=null;
	this.location=null;
	this.id=null;
	this.owner=null;
	this.date=null;
this.calendar=cal?parseInt(cal):1; this.option=option?parseInt(option):1; this.title=title?title:''; this.explain=explain?explain:''; this.location=loc?parseInt(loc):0;
this.id=id?parseInt(id):0; this.owner=owner?owner:''; this.date=_date?_date:'';
	
	this.getKind=function()
	{
		return (this.option & 31);
	};
};



Aniversary.table='anniversary_tb';
Aniversary.activeObject=null;
Aniversary.momentUI=null;
Aniversary.loadLevel=0;
Aniversary.loadingCalendar=null;
Aniversary.loadCallback=null;
Aniversary.loadUpper=false;


Aniversary.save=function(o)
{
	if(!LU.net)LU.net=new NetworkTransfer();
	var n=LU.net;
	n.clear();
	n.method="POST";
	n.target="client/Aniversary/save/";
	n.add("xml",Aniversary.toXml(o));
	n.callback=LU.globalCallback?LU.globalCallback:null;
	n.onerror=null;
	n.send();
};
Aniversary.search=function(owner,param,calendar,similar,min,max,dl,ul)
{
	if(!LU.net)LU.net=new NetworkTransfer();
	var n=LU.net;
	n.clear();
	n.target="client/Aniversary/search/";
	if(calendar)n.add("calendar",calendar);
	if(param)n.add("param",param,true);
	if(similar)n.add("similar",similar,true);
	if(min)n.add("min",min,true);
	if(max)n.add("max",max,true);
	if(dl>=0){
	    n.add("dl",dl);
	    n.add("ul",ul);
	}
	n.callback=LU.globalCallback?LU.globalCallback:null;
	n.onerror=null;
	n.send();
};
Aniversary.remove=function(uid,id)
{
	if(!LU.net)LU.net=new NetworkTransfer();
	var n=LU.net;
	n.clear();
	n.target="client/Aniversary/remove/";
	n.add("id",id,true);
	//n.add("xml",Aniversary.toXml(o));
	n.callback=LU.globalCallback?LU.globalCallback:null;
	n.onerror=null;
	n.send();
};
Aniversary.toXml=function(o)
{
	if(o instanceof Array)
	{
		var ret="";
		for(var i=0;i<o.length;i++)
		{
			if(o[i])ret+=Aniversary.toXml(o[i]);
		}
		return ret;
	}
	else
	{
		return "<Aniversary calendar=\""+o.calendar+"\" option=\""+o.option+"\" title=\""+o.title+"\" explain=\""+o.explain+"\" location=\""+o.location+"\" id=\""+o.id+"\" owner=\""+o.owner+"\" date=\""+(Moment.getStamp(o.date))+"\"/>";
	}
};
Aniversary.parseXml=function(arg)
{
	if(typeof(arg)=="string")
	{
		if(window.DOMParser)
		{
			var parser=new DOMParser();
			var doc=parser.parseFromString(arg,"text/xml");
		}
		else if(Window.ActiveXObject)
		{
			var doc=new ActiveXObject("Microsoft.DOMXML");
		}
		else return;
		
		var ret=[];
		var items=doc.getElementsByTagName('Aniversary');
		for(var i=0;i<items.length;i++)
		{
			ret.push(new Aniversary.parseXml(items[i]))
		}
		return ret;
	}
	else
	{
		return new Aniversary(arg.getAttribute("owner"),arg.getAttribute("calendar"),arg.getAttribute("option"),arg.getAttribute("title"),arg.getAttribute("explain"),arg.getAttribute("location"),Moment.parseStamp(arg.getAttribute("date")),arg.getAttribute("id"));
	}
};
Aniversary.buildForm=function(o,view,par)
{
	Aniversary.activeObject=o;
	return Jet.App.buildForm(o,1,par);
};
Aniversary.config=function()
{
	Jet.App.register("Aniversary",Aniversary);
	Jet.App.form.Aniversary={};
	Jet.App.form.Aniversary[1]="<table class=\"aniversary_1\"><tr><td>%title-lbl%</td> <td><input class=\"textbox\" type=\"text\" id=\"atitleTxb\" value=\"%title%\"/></tr><tr><td>%date-lbl%</td> <td id=\"adatePan\"></td></tr></table><table class=\"aniversary_1 infobox\"><tr><td></td> <td><input type=\"checkbox\" id=\"aglobalChb\"/> %global-lbl% &nbsp; &nbsp; <input type=\"checkbox\" id=\"holidayChb\" /> %holiday-lbl%</td></tr><tr><td>%kind-lbl%</td><td id=\"kindPan\"></td></tr><!--<tr><td>%location-lbl%</td> <td><input type=\"hidden\" id=\"alocationTxb\" value=\"%location%\"/></td></tr>--><tr><td>%explain-lbl%</td> <td><textarea id=\"aexplainTxb\">%explain%</textarea></td></tr><tr><td></td> <td><button class=\"green btn\" onclick=\"Aniversary.onSave()\">%save-lbl%</button></td></tr></table>";
	Jet.App.form.Aniversary[2]="";
	
	Jet.App.form.Aniversary.userButton="";
	
	Jet.App.form.Aniversary.ownerButton=Jet.App.form.Aniversary+
	"";
};
Aniversary.onSave=function()
{
	var o=Aniversary.activeObject;
	var mu=Aniversary.momentUI;
	var m=mu.value();
	//var k=0;//parseInt(m.calendar);
	var k=_("#akindCmb").value();
	/*if(k==Moment.solar){
	    m=Moment.fconvert(m,Moment.gregorian);
	}*/
	o.title=_("#atitleTxb").value();
	//o.date=m.year+"-"+m.month+"-"+m.day+" 00:00:00";
	o.date=m;
	o.calendar=m.calendar;
	var g=_("#aglobalChb").value();//store in option
	var h=_("#holidayChb").value();
	g=g?128:0;
	h=h?64:0;
	o.option=(g|h|k);
	o.location=0;
	o.explain=_("#aexplainTxb").value();
	LU.activeObject=o;
	LU.globalCallback=LU.save;
	Aniversary.save(o);
};
Aniversary.bind=function(o,dlg)
{
	if(Calendar.activeObject){
	    var mu=new MomentUI("",true,true,false,false,Calendar.activeObject.moment);
	    mu.buildForm(document.getElementById("adatePan"));
	    Aniversary.momentUI=mu;
	    Aniversary.getKindCmb(0,"kindPan");
	}
};
Aniversary.load=function(calendar)
{
	if(calendar)
	{
	    Aniversary.loadCallback=LU.globalCallback;
	    Aniversary.loadingCalendar=calendar;
	    //Aniversary.loadLevel=0; //load main calenar first
	    Aniversary.loadLevel=calendar.calType; //load main calenar first
	    Aniversary.loadUpper=false;
	    Aniversary.loadList={};
	    Aniversary.load();
	}
	else if(Aniversary.loadingCalendar)
	{
	    LU.globalCallback=Aniversary.loadBack;
	    var c=Aniversary.loadingCalendar;
	    
	    if(Aniversary.loadUpper)var d0=c.dayList[c.dayList.length-1];
	    else var d0=c.dayList[0];
	    
	    switch(Aniversary.loadLevel){
	        case Moment.gregorian:
	            if(c.calType==Moment.gregorian)
	                Aniversary.search(null,'',Moment.gregorian,"-"+("0"+d0.month).slice(-2)+"-");
	            else{
	                var m=null;
	                for(var i=0;i<d0.slaves.length;i++){
	                    if(d0.slaves[i].calendar==Moment.gregorian){
	                        m=d0.slaves[i];
	                        break;
	                    }
	                }
	                if(m)
	                    Aniversary.search(null,'',Moment.gregorian,"-"+("0"+m.month).slice(-2)+"-");
	            }
	            break;
	        case Moment.solar:
	            if(c.calType==Moment.solar)
	                Aniversary.search(null,'',Moment.solar,"-"+("0"+d0.month).slice(-2)+"-");
	            else{
	                var m=null;
	                for(var i=0;i<d0.slaves.length;i++){
	                    if(d0.slaves[i].calendar==Moment.gregorian){
	                        m=d0.slaves[i];
	                        break;
	                    }
	                }
	                if(m)
	                    Aniversary.search(null,'',Moment.solar,"-"+("0"+m.month).slice(-2)+"-");
	            }
	            break;
	        case Moment.lunar:
	            if(c.calType==Moment.lunar)
	                Aniversary.search(null,'',Moment.lunar,"-"+("0"+d0.month).slice(-2)+"-");
	            else{
	                var m=null;
	                for(var i=0;i<d0.slaves.length;i++){
	                    if(d0.slaves[i].calendar==Moment.lunar){
	                        m=d0.slaves[i];
	                        break;
	                    }
	                }
	                if(m)
	                    Aniversary.search(null,'',Moment.lunar,"-"+("0"+m.month).slice(-2)+"-");
	            }
	            break;
	        case Moment.bayani:
	            if(c.calType==Moment.bayani)
	                Aniversary.search(null,'',Moment.bayani,"-"+("0"+d0.month).slice(-2)+"-");
	            else{
	                var m=null;
	                for(var i=0;i<d0.slaves.length;i++){
	                    if(d0.slaves[i].calendar==Moment.bayani){
	                        m=d0.slaves[i];
	                        break;
	                    }
	                }
	                if(m)
	                    Aniversary.search(null,'',Moment.lunar,"-"+("0"+m.month).slice(-2)+"-");
	            }
	            break;
	        case Moment.bayani:
	            break;
	        default:
	            break;
	    }
	}
};
Aniversary.loadBack=function(res)
{
	if(res)
	{
	    var alist=Aniversary.parseXml(res); var d=null;
	    var day=null; var moment=null; var calType=null;
	    for(var j=0;j<alist.length;j++)
	    {
	        //calType=alist[j].getCalendar();
	        for(var i=0;i<Aniversary.loadingCalendar.dayList.length;i++){
	            d=Aniversary.loadingCalendar.dayList[i];
	            moment=d.getMoment(alist[j].calendar);
	            if(moment.month==alist[j].date.month && moment.day==alist[j].date.day){
	                d.anniversaries.push(alist[j]);
	            }
	        }
	    }
	    var index=0;
	    if(Aniversary.loadLevel!=Aniversary.loadingCalendar.calType){
	        index=CalSetting.slaveCalendars.indexOf(Aniversary.loadLevel+"");/* stored in string type ofn slaveCalendar */
	        if(Aniversary.loadUpper){
	            index++;
	            Aniversary.loadUpper=false;
	        }else{
	            Aniversary.loadUpper=true;
	        }
	    }
	    var cal=CalSetting.slaveCalendars[index];
	    if(cal){
	        Aniversary.loadLevel=parseInt(cal);
	        Aniversary.load();
	    }
	    else
	    {
	        Aniversary.loadLevel=0;
	        //finalize
	        if(Aniversary.loadCallback){
	            Aniversary.loadCallback();
	            Aniversary.loadCallback=null;
	        }
	    }
	}
};
Aniversary.getKindCmb=function(selected,par,id)
{
	if(!id)id="akindCmb";
	var cmb=document.createElement("select");
	cmb.setAttribute('id',id);
	var keys=Object.keys(anniversaryKinds);
	var opt=null;
	for(var i=0;i<keys.length;i++){
	    opt=document.createElement('option');
	    opt.setAttribute("value",keys[i]);
	    opt.innerHTML=anniversaryKinds[keys[i]];
	    cmb.appendChild(opt);
	}
	
	if(typeof(par)=="string")par=document.getElementById(par);
	par.appendChild(cmb);
};

function CalSetting(owner,type,date,tasks,zoneTime)
{
	
	this.owner=null;
	this.zoneTime=null;
this.owner="me"; this.type=type?type:1; this.date=date?date:new Date(Date.now()); this.tasks=tasks?tasks:[]; this.zoneTime=zoneTime?zoneTime:0;
};



CalSetting.calType=null;
CalSetting.table='cal_tb';
CalSetting.defaultType=Moment.gregorian;
CalSetting.slaveCalendars=null;


CalSetting.load=function()
{
	LU.clear();
	var r=null;
	if(localStorage)
	{
	    if((r=localStorage.getItem('settingCalType')))CalSetting.calType=parseInt(r);
	    else CalSetting.calType=CalSetting.defaultType;
	    if((r=localStorage.getItem('settingSlaveCal')))CalSetting.slaveCalendars=r.split(',');
	    else CalSetting.slaveCalendars=[];
	}
	var cal=new Calendar(CalSetting.calType);
	Calendar.activeObject=cal;
	LU.globalCallback=function(){
	    Calendar.buildForm(Calendar.activeObject,1,LU.painterArea);
	    Task.load(Calendar.activeObject);
	};
	Aniversary.load(cal);
};
CalSetting.buildForm=function(o,view,par)
{
	par=document.getElementById(par);
	par.innerHTML=Jet.App.bindToObject({},"<table><tr><td>%calendarType-lbl%</td> <td><select id=\"calTypeCmb\" onchange=\"CalSetting.save()\"><option value=\"1\">%gregorian-lbl%</option><option value=\"2\">%solar-lbl%</option><option value=\"3\">%other-lbl%</option></select></td></tr><tr><td>%slaveCalendar-lbl%</td> <td><ul id=\"slaveCalendarList\"></ul></td></tr></table>",StrRes);
	_("#calTypeCmb").value(CalSetting.calType);
	var cals=Object.keys(calendarNames);
	var slaveList=document.getElementById('slaveCalendarList');
	for(var i=0;i<cals.length;i++)
	{
	    if(CalSetting.calType!=cals[i])
	    {
	        li=document.createElement('li');
	        ch=document.createElement('input');
	        ch.setAttribute("type","checkbox");
	        ch.setAttribute("id","slaveCalChb"+cals[i]);
	        ch.setAttribute("onclick","CalSetting.save()");
	        if(CalSetting.slaveCalendars.indexOf(cals[i])>=0)ch.checked=true;
	        li.appendChild(ch);
	        li.appendChild(document.createTextNode(" "+calendarNames[cals[i]]));
	        slaveList.appendChild(li);
	    }
	}
};
CalSetting.save=function()
{
	if(localStorage)
	{
	    var calType=_("#calTypeCmb").value();
	    if(calType==1 || calType==2)//filter saving other calendars
	        localStorage.setItem('settingCalType',calType);
	    var cals=Object.keys(calendarNames);
	    var slaveList=document.getElementById('slaveCalendarList');
	    var ch=null;
	    CalSetting.slaveCalendars.length=0;
	    for(var i=0;i<cals.length;i++)
	    {
	        ch=document.getElementById("slaveCalChb"+cals[i]);
	        if(ch)
	        {
	            if(ch.checked){
	                CalSetting.slaveCalendars.push(cals[i]);
	            }
	        }
	    }
	    localStorage.setItem("settingSlaveCal",CalSetting.slaveCalendars.join(","));
	}
};

function Day(year,month,day,number)
{
	
	this.day=null;
	this.month=null;
	this.year=null;
	this.stamp=null;
	this.tasks=null;
	this.dialog=null;
	this.dayNumber=null;
	this.slaves=null;
	this.anniversaries=null;
	this.tasks=null;
this.day=day?day:null; this.month=month?month:null; this.year=year?year:null; this.number=number?number:1;
this.stamp=day+"_"+month+"_"+year; this.slaves=[]; this.anniversaries=[]; this.tasks=[];
	
	this.getMoment=function(calType)
	{
		var c=Calendar.activeObject;
		if(c.calType==calType)
		{
		    return new Moment(this.year,this.month,this.day,0,0,0,calType);
		}
		else
		{
		    for(var i=0;i<this.slaves.length;i++){
		        if(this.slaves[i].calendar==calType){
		            return this.slaves[i];
		        }
		    }
		}
		// if not exists
		return Moment.fconvert(new Moment(this.year,this.month,this.day,0,0,0,c.calType),calType);
	};
};



Day.activeObject=null;


Day.buildForm=function(o,view,par)
{
	o.dialog= Jet.App.buildForm(o,view,par);
	o.dialog.lObj=o;
	return o.dialog;
};
Day.config=function()
{
	Jet.App.register("Day",Day);
	Jet.App.form.Day={};
	Jet.App.form.Day[1]="<div><b>%day%</b>/</div><div id=\"slaves%stamp%\" class=\"slaveDate\"></div><ul id=\"dayBox%stamp%\"></ul><div id=\"anivBox%stamp%\"></div>";
	Jet.App.form.Day[2]="";
	Jet.App.form.Day[3]="<table style=\"width:100%\"><tr><td><div><b>%day%/%month%/%year%</b>&nbsp;</div><div id=\"infoSlaves%stamp%\" class=\"slaveDate\"></div><ul id=\"dayBox%stamp%\"><!-- task summeries goes here --></ul><div id=\"infoAnivBox%stamp%\" class=\"infoAnniversary\"></div></td><td id=\"taskPan\"></td></tr></table>";
	
	JetApp.form["Day1par"]="div";
	JetApp.form["Day1cssClass"]="day";
	
	Jet.App.form.Day.userButton="";
	
	Jet.App.form.Day.ownerButton=Jet.App.form.Day.userButton+
	"";
};
Day.bind=function(o,ctrl,view)
{
	if(!view)view=1;
	var sl=null;
	var mname="";
	for(var i=0;i<o.slaves.length;i++)
	{
	    switch(o.slaves[i].calendar)
	    {
	        case Moment.gregorian:
	            mname=StrRes[Moment.gregorian_month_name[o.slaves[i].month-1].toLowerCase()];
	            break;
	        case Moment.solar:
	            mname=StrRes[Moment.solar_month_name[o.slaves[i].month-1].toLowerCase()];
	            break;
	        case Moment.lunar:
	            mname=StrRes[Moment.lunar_month_name[o.slaves[i].month-1].toLowerCase()];
	            break;
	        case Moment.bayani:
	            mname=StrRes[Moment.bayani_month_name[o.slaves[i].month-1].toLowerCase()];
	            break;
	        default:
	            mname="/"+o.slaves[i].calendar+"/";
	            break;
	    }
	    sl=document.createElement('span');
	    sl.innerHTML=o.slaves[i].day+"/"+o.slaves[i].month;
	    sl.setAttribute("title",o.slaves[i].day+" "+mname+" "+o.slaves[i].year+" "+calendarNames[o.slaves[i].calendar]);
	    var dlg=null;
	    if(view==1)dlg=_("#slaves"+o.stamp);
	    else if(view==3)dlg=_("#infoSlaves"+o.stamp);
	    if(dlg)dlg.source.appendChild(sl);
	}
	if(view==1)ctrl.onclick=Day.select;
	else if(view==3)
	{
	    var spn=null;
	    for(var i=0;i<o.anniversaries.length;i++){
	        spn=document.createElement('span');
	        spn.innerHTML=o.anniversaries[i].title;
	        spn.setAttribute("title",o.anniversaries[i].explain);
	        (document.getElementById('infoAnivBox'+o.stamp)).appendChild(spn);
	    }
	    for(var j=0;j<o.tasks.length;j++){
	        Task.buildForm(o.tasks[j],2,"taskPan");
	    }
	}
};
Day.select=function(e)
{
	if(Day.activeObject){
	    (new JetHtml(Day.activeObject.dialog)).removeClass('selected');
	}
	if(e.target.lObj)
	{
	    Day.activeObject=e.target.lObj;
	    (new JetHtml(e.target)).addClass("selected");
	    Day.showInfo(Day.activeObject);
	}
	else e.target.parentElement.click();
};
Day.showInfo=function(day)
{
	_("#calboard").source.innerHTML="";
	Jet.App.buildForm(day,3,"calboard");
};

function Calendar(calType,sampleDate)
{
	
	this.today=null;
	this.dayList=null;
	this.calType=null;
	this.moment=null;
	this.anniversaries=null;
Calendar.activeObject=this;
this.calType=calType;
var d=new Date(Date.now());
var tmoment=new Moment(d.getFullYear(),d.getMonth()+1,d.getDate());
var tday=d.getDay()+2;
tmoment.calendar=Moment.gregorian;
dayCount=0;
if(calType==Moment.gregorian)
{
    this.moment=tmoment;
    if(!sampleDate)sampleDate=tmoment;
    dayCount=Moment.gregorian_month[sampleDate.month-1];
}
else if(calType==Moment.solar || calType==Moment.bayani)
{
    this.moment=Moment.fconvert(tmoment,Moment.solar);
    if(calType==Moment.bayani)
    {
        this.moment=Moment.fconvert(this.moment,Moment.bayani);
        if(!sampleDate)sampleDate=this.moment;
        dayCount=Moment.bayani_month[sampleDate.month-1];
    }
    else
    {
        //same solar
        if(!sampleDate)sampleDate=this.moment;
        dayCount=Moment.solar_month[sampleDate.month-1];
    }
}
this.dayList=[];
var tmp=null;
this.today=null;
var dm=null;
for(var i=1;i<=dayCount;i++)
{
    tmp=new Day(sampleDate.year,sampleDate.month,i,Calendar.getDayOfWeek(this.moment.day,tday,i));
    this.dayList[i-1]=tmp;
    dm=new Moment(tmp.year,tmp.month,tmp.day); dm.calendar=calType;
    for(var j=0;j<CalSetting.slaveCalendars.length;j++)
    {
        tmp.slaves.push(Moment.fconvert(dm,parseInt(CalSetting.slaveCalendars[j])));
    }
    if(tmp.year==this.moment.year && tmp.month==this.moment.month && tmp.day==this.moment.day)
    {
        this.today=tmp;
        this.today.dayNumber=d.getDay()+2;
    }
}
};



Calendar.activeObject=null;


Calendar.buildForm=function(o,view,par)
{
	var ret=Jet.App.buildForm(o,view,par);
	for(var i=1;i<o.dayList[0].number;i++)
	{
	    hday=document.createElement('div');
	    hday.setAttribute("class", "day hiddenDay");
	    //ret.appendChild(hday);
	    _("#calDay"+i).value(hday);
	}
	var dret=null;
	if(view%2 !==0)for(var i=0;i<o.dayList.length;i++){
	    dret=Day.buildForm(o.dayList[i],view,"calDay"+o.dayList[i].number);
	    if(o.calType==Moment.gregorian){if(o.dayList[i].number==2)dret.setAttribute('class','day holiday');}
	    else if(o.calType==Moment.solar){if(o.dayList[i].number==7)dret.setAttribute('class','day holiday');}
	}
	
	var mname=null;
	if(o.calType==Moment.gregorian)mname=Moment.gregorian_month_name;
	else if(o.calType==Moment.solar)mname=Moment.solar_month_name;
	else if(o.calType==Moment.bayani)mname=Moment.bayani_month_name;
	if(o.calType==Moment.lunar)mname=Moment.lunar_month_name;
	
	if(o.today){
	    (new JetHtml(o.today.dialog)).addClass("today");
	    var title=o.today.day+" "+StrRes[(mname[o.today.month-1]).toLowerCase()]+" "+o.today.year;
	    _("#dayCalendarTitle").value(title);
	}
	else
	{
	    var title=StrRes[(mname[o.dayList[0].month-1]).toLowerCase()]+" "+o.dayList[0].year;
	    _("#dayCalendarTitle").value(title);
	}
	return ret;
};
Calendar.config=function()
{
	Jet.App.register("Calendar",Calendar);
	Jet.App.form.Calendar={};
	Jet.App.form.Calendar[1]="<div id=\"calendarArea\" class=\"calendar\"><ul id=\"calDay1\"></ul><ul id=\"calDay2\"></ul><ul id=\"calDay3\"></ul><ul id=\"calDay4\"></ul><ul id=\"calDay5\"></ul><ul id=\"calDay6\"></ul><ul id=\"calDay7\"></ul></div>";
	Jet.App.form.Calendar[2]="<table class=\"calTable\" \"calendarArea\"></ul>";
	
	Jet.App.form.Calendar.userButton="";
	
	Jet.App.form.Calendar.ownerButton=Jet.App.form.userButton+
	"";
};
Calendar.nextMonth=function()
{
	var tMoment=new Moment(0,1,0);
	var day0=Calendar.activeObject.dayList[Calendar.activeObject.dayList.length-1];
	var moment=new Moment(day0.year,day0.month,day0.day);
	moment.calendar=Calendar.activeObject.calType;
	var ncal=new Calendar(Calendar.activeObject.calType,Moment.add(moment,tMoment));
	if(day0.number==7)ncal.dayList[0].number=1;
	else ncal.dayList[0].number=day0.number+1;
	for(var i=1;i<ncal.dayList.length;i++)
	{
	    ncal.dayList[i].number=Calendar.getDayOfWeek(1,ncal.dayList[0].number,ncal.dayList[i].day);
	}
	LU.clear();
	//Calendar.buildForm(ncal,1,LU.painterArea);
	Calendar.activeObject=ncal;
	LU.globalCallback=function(){
	    Calendar.buildForm(Calendar.activeObject,1,LU.painterArea);
	    Task.load(Calendar.activeObject);
	};
	Aniversary.load(ncal);
};
Calendar.previewsMonth=function()
{
	var tMoment=new Moment(0,-1,0);
	var day0=Calendar.activeObject.dayList[0];
	var moment=new Moment(day0.year,day0.month,day0.day);
	moment.calendar=Calendar.activeObject.calType;
	var ncal=new Calendar(Calendar.activeObject.calType,Moment.add(moment,tMoment));
	if(day0.number==1)ncal.dayList[ncal.dayList.length-1].number=7;
	else ncal.dayList[ncal.dayList.length-1].number=day0.number-1;
	for(var i=0;i<ncal.dayList.length-1;i++)
	{
	    ncal.dayList[i].number=Calendar.getDayOfWeek(ncal.dayList[ncal.dayList.length-1].day,ncal.dayList[ncal.dayList.length-1].number,ncal.dayList[i].day);
	}
	LU.clear();
	//Calendar.buildForm(ncal,1,LU.painterArea);
	Calendar.activeObject=ncal;
	LU.globalCallback=function(){
	    Calendar.buildForm(Calendar.activeObject,1,LU.painterArea);
	    Task.load(Calendar.activeObject);
	};
	Aniversary.load(ncal);
};
Calendar.currentMonth=function()
{
	LU.clear();
	var cal=new Calendar(CalSetting.calType);
	Calendar.activeObject=cal;
	LU.globalCallback=function(){
	    Calendar.buildForm(Calendar.activeObject,1,LU.painterArea);
	    Task.load(Calendar.activeObject);
	};
	Aniversary.load(cal);
};
Calendar.getDayOfWeek=function(sample_day,number,day)
{
	var d7=(sample_day%7);
	var dw=number-d7;
	var dd=day%7;
	var res= dd+dw;
	if(res>7)
	    res-=7
	if(res===0)
	    return 7
	return res
};
