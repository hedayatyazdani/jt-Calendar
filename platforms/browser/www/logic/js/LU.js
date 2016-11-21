function LU()
{
	
	this.db=null;
};



LU.painterArea='paintArea';
LU.net=null;
LU.activeObject=null;
LU.serverRoot='';
LU.cloud=true;
LU.offline=true;


LU.clear=function()
{
	document.getElementById(LU.painterArea).innerHTML="";
};
LU.config=function()
{
	Jet.App.dictionary=StrRes;
	Calendar.config();
	Day.config();
	Moment.config();
	Aniversary.config();
	Task.config();
	MomentUI.config(StrRes);
	LU.IDB.start();
};
LU.contrastColor=function(color)
{
	color=color.replace("#","");
	var pat=/(\w\w)(\w\w)(\w\w)/;
	if((r=pat.exec(color))){
	    var color={
	        "r":parseInt("0x"+r[1]),
	        "g":parseInt("0x"+r[2]),
	        "b":parseInt("0x"+r[3])
	    };
	    var lum= (((0.299 * color.r) + ((0.587 * color.g) + (0.114 * color.b)))  / 255);
	    return lum>0.5? "#000" : "#fff";
	}
};
LU.save=function(res)
{
	if(parseInt(res)>0){
		TabsCore.alert(StrRes.saved);
		if(LU.activeObject)LU.activeObject.id=parseInt(res);
	}else {
		LU.error(res);
	}
};
LU.error=function(res)
{
	TabsCore.alert(StrRes['error'],TabsCore.errorAlert);
};


LU.IDB=function()
{
};



LU.IDB.onsuccess=function(evt)
{
	LU.db=evt.target.result;
	CalSetting.load();
};
LU.IDB.onupgradeneeded=function(evt)
{
	LU.db=evt.target.result;
	
	var ts=LU.db.createObjectStore("task",{keyPath:'id'});
	var ds=LU.db.createObjectStore("task_draft",{autoIncrement:true});
	
	ts.createIndex('ending','monthStamp');
	ds.createIndex('ending','monthStamp');
};
LU.IDB.onerror=function(evt)
{
	LU.db=evt.target.result;
	TabsCore.alert("Error to connect local database.",TabsCore.errorAlert);
	LU.offline=false;
	CalSetting.load();
};
LU.IDB.start=function()
{
	var req=window.indexedDB.open("jtCalendar",1);
	req.onupgradeneeded=LU.IDB.onupgradeneeded;
	req.onsuccess=LU.IDB.onsuccess;
	req.onerror=LU.IDB.onerror;
};
