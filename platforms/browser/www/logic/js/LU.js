function LU()
{
};



LU.painterArea='paintArea';
LU.net=null;
LU.activeObject=null;


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
