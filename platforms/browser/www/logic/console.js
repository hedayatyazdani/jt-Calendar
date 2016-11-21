var jtConsole={};
jtConsole.about="jointab console version 2. author jointab development team."
jtConsole.ui=null;
jtConsole.display=null
jtConsole.buffer=null;
jtConsole.callback=null;
jtConsole.ps2="Command &gt;&nbsp; ";
jtConsole.commander=null;
jtConsole.start=function()
{
    jtConsole.ui=document.getElementById("consoleTxb");
    jtConsole.ui.onclick=jtConsole.focus;
    jtConsole.display=document.getElementById("consoleDisplay");
    jtConsole.buffer=document.getElementById("consoleBuffer");
    //jtConsole.ui.contentEditable=true;
    jtConsole.buffer.onkeyup=jtConsole.onkeyup;
    if(jtConsole.commander)jtConsole.callback=jtConsole.commander;
	else jtConsole.callback=jtConsole.process;
};
jtConsole.goEnd=function()
{
    jtConsole.ui.scrollTop=jtConsole.ui.scrollHeight;
};
jtConsole.show=function(msg,kind)
{
    if (typeof(kind)=="undefined")kind="consoleInfo";
    jtConsole.display.innerHTML+="<p class=\""+kind+"\">"+msg+"</p>";
};
jtConsole.onkeyup=function(evt)
{
    if (evt.keyCode==13) {
        if (jtConsole.callback)jtConsole.callback(jtConsole.buffer.value);
        jtConsole.buffer.value="";
        jtConsole.goEnd();
    }
}
jtConsole.focus=function()
{
  jtConsole.buffer.focus();  
};
jtConsole.buildForm=function(par)
{
	/*<div id="consolePan" class="panStart">
		<div id="consoleTxb">
			<div id="consoleDisplay">jointab console version 0.1</div>
			<div>Command &gt;<input type="text" id="consoleBuffer"/></div>
		</div>
	</div>*/
	var pan=document.createElement('div');
	pan.setAttribute('id','consolePan');
	//pan.setAttribute('class','panStart');
	
	var disp=document.createElement('div');
	disp.setAttribute('id','consoleDisplay');
	
	var ctext=document.createElement('div');
	ctext.setAttribute('id','consoleTxb');
	
	var cmd=document.createElement('div');
	cmd.innerHTML=jtConsole.ps2;
	
	var tx=document.createElement('input');
	tx.setAttribute('type','text');
	tx.setAttribute('id','consoleBuffer');
	
	cmd.appendChild(tx);
	ctext.appendChild(disp);
	ctext.appendChild(cmd);
	pan.appendChild(ctext);
	if(par)
	{
		par=typeof(par)=="string"?document.getElementById(par):par;
		par.appendChild(pan);
	}
	return pan;
}
jtConsole.getTime=function()
{
	var d=new Date(Date.now());
	var res="h:m:s".replace("h",d.getHours()).replace("m",d.getMinutes()).replace("s",d.getSeconds());
	return res;
}
jtConsole.getDate=function()
{
	var d=new Date(Date.now());
	var res="y/m/d".replace("y",d.getFullYear()).replace("m",d.getMonth()+1).replace("d",d.getDate());
	return res;
}
jtConsole.process=function(cmd)
{
    jtConsole.show(jtConsole.ps2+cmd);
    switch(cmd.toLowerCase())
    {
        case 'hi': jtConsole.show("hi"); break;
        case 'ver': case 'version': jtConsole.show(jtConsole.about); break;
        case 'clear': jtConsole.display.innerHTML="";break;
		case 't': case 'time': jtConsole.show(jtConsole.getTime());break;
		case 'date': case 'd': jtConsole.show(jtConsole.getDate()); break;
		case 'moment': case 'm': jtConsole.show(jtConsole.getDate()+" "+jtConsole.getTime()); break;
        default:
            jtConsole.show("Bad Command -&gt; "+cmd,"error");
            break;
    }
}
