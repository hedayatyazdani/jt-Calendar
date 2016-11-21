function Popup(itemMode,inner,css)
{
	
	this.x=0;
	this.y=0;
	this.dialog=null;
	this.title=null;
	this.maxWidth=250;
	this.maxHeight=350;
	this.relatedControl=null;
	this.showScrollY=true;
	this.showScrollX=false;
	this.items=null;
	this.itemMode=null;
	this.index=null;
	this.focusOutMode=false;
	this.css=null;
	this.activeIndex=0;
this.items=[]; this.itemMode=itemMode?true:false; this.css=css?css:"backDialog";

if(!Popup.list)Popup.list=[];
var nindex=Popup.list.length;
Popup.list[nindex]=this;
this.index=nindex;
	
	this.show=function(parent,force)
	{
		//var par=typeof(parent)=="string"?document.getElementById(parent):parent;
		document.body.appendChild(Popup.buildForm(this),force);
		Popup.setBound(this);
		Popup.activeObject=this;
		this.isOpen=true;
	};
	this.addItem=function(item)
	{
		var nindex=this.items.length;
		//Popup.list[nindex]=item;
		this.items[nindex]=item;
		item.index=nindex;
		item.popupIndex=this.index;
		//buildForm
		if(this.dialog)
		{
		    this.dialog.ul.appendChild( PopupItem.buildForm(item) );
		}
	};
};



Popup.list=null;
Popup.isOpen=false;
Popup.mouseX=0;
Popup.mouseY=0;
Popup.eventObject=null;
Popup.activeObject=null;


Popup.buildForm=function(o,force)
{
	if(!o.dialog || force)
	{
	    o.output=null;
	    var d=document.createElement("div");
	    var back=document.createElement("div");
	    o.dialog=d;
	    o.backDialog=back;
	    if(!o.focusOutMode)
	    {
	        back.appendChild(d);
	        o.output=o.backDialog;
	        d.setAttribute("class","dialog");
	    }
	    else
	    {
	        o.output=o.dialog;
	    }
	    o.backDialog.oncontextmenu=Popup.backEvent;
	    if(o.css)o.output.setAttribute("class",o.css);
	    //set onclick events
	    o.backDialog.onclick=Popup.closeAll;
	    //o.dialog.onclick=Popup.onclickpopup;
	    //openning size
	    if(o.maxHeight)d.style.height=o.maxHeight;
	    else
	    {
	        var h=window.innerHeight-o.y;
	        d.style.height=h+"px";
	    }
	    
	    if(o.maxWidth)d.style.width=o.maxWidth;
	    else
	    {
	        var w=window.innerWidth-o.x;
	        d.style.width=w+"px";
	    }
	    //openning position //refer to setBounds
	    /*if(o.relatedControl)
	    {
	        var b=o.relatedControl.getBoundingClientRect();
	        o.y=(b.height+b.top+window.scrollY);
	        o.x=b.left+window.scrollX;
	        //d.style.top=(b.height+b.top)+"px";
	        //d.style.left=b.left+"px";
	        if(o.focusOutMode)
	        {
	            o.relatedControl.addEventListener("focusout",Popup.closeAll,false);
	            o.relatedControl.addEventListener("blur",Popup.closeAll,false);
	        }
	    }
	    else
	    {
	        /*if(document.body.offsetWidth>(Popup.mouseX-o.dialog.offsetWidth))o.x=Popup.mouseX;
	        else o.x=Popup.mouseX-o.dialog.offsetWidth;
	        
	        if(document.body.offsetHeight>(Popup.mouseY-o.dialog.offsetHeight))o.y=Popup.mouseY;
	        else o.y=Popup.mouseY-o.dialog.offsetHeight;
	        o.x=Popup.mouseX;
	        o.y=Popup.mouseY;
	        //refer to set bounding Method
	        //if(o.x+o.dialog.offsetWidth>window.innerWidth)o.x=window.innerWidth-o.dialog.offsetWidth;
	        //if(o.y+o.dialog.offsetHeight>window.innerHeight)o.y=window.innerHeight-o.dialog.offsetHeight;
	        
	    }
	    //d.style.top=o.y+"px";
	    //d.style.left=o.x+"px";*/
	    
	    
	    //item mode or note
	    if(o.itemMode)
	    {
	        d.ul=document.createElement("ul");
	        for(var i=0;i<o.items.length;i++)
	        {
	            d.ul.appendChild( PopupItem.buildForm(o.items[i]) );
	        }
	        d.appendChild(d.ul);
	    }
	}
	else
	{
	    var d=o.dialog;
	    /* refer to setBound
	    if(!o.relatedControl)
	    {
	        o.x=Popup.mouseX;
	        o.y=Popup.mouseY;
	        //if(o.x+o.dialog.offsetWidth>window.innerWidth)o.x=window.innerWidth-o.dialog.offsetWidth;
	        //if(o.y+o.dialog.offsetHeight>window.innerHeight)o.y=window.innerHeight-o.dialog.offsetHeight;
	        /*if(o.x+o.maxWidth>window.innerWidth)o.x=window.innerWidth-o.maxWidth;
	        if(o.y+o.maxHeight>window.innerHeight)o.y=window.innerHeight-o.maxHeight;
	        d.style.top=o.y+"px";
	        d.style.left=o.x+"px"; //refer to setBounding Method
	    }*/
	    
	    //item mode or note
	    if(o.itemMode)
	    {
	        var ul=d.ul; ul.innerHTML="";//clear list and add items
	        for(var i=0;i<o.items.length;i++)
	        {
	            if(o.items[i].dialog)ul.appendChild(o.items[i].dialog);
	            else ul.appendChild( PopupItem.buildForm(o.items[i]) );
	        }
	    }
	}
	return o.output;
};
Popup.closeAll=function(e)
{
	var o=null;
	for(var i=0;i<Popup.list.length;i++)
	{
	    o=Popup.list[i];
	    if(o.dialog && o.isOpen)
	    {
	        document.body.removeChild(o.output);
	        o.isOpen=false;
	    }
	}
};
Popup.onclickpopup=function(evt)
{
	if(evt.stopPropagation)evt.stopPropagation();
	if(evt.cancelBubble)evt.cancelBubble=true;
};
Popup.getMouse=function(evt)
{
	Popup.mouseX=evt.clientX;
	Popup.mouseY=evt.clientY;
};
Popup.backEvent=function(e)
{
	return false;
};
Popup.set=function(obj,popup)
{
	obj.popupMenu=popup;
	obj.oncontextmenu=function(e)
	{
	  Popup.getMouse(e);
	  Popup.eventObject=e.target;
	  e.target.popupMenu.show();
	  return false;  
	};
};
Popup.clearItems=function(popup)
{
	if(popup.dialog)
	{
	    popup.dialog.ul.innerHTML="";
	    popup.items.length=0;
	}
};
Popup.setBound=function(o)
{
	if(o.relatedControl)
	{
	    var b=o.relatedControl.getBoundingClientRect();
	    o.y=(b.height+b.top+window.scrollY);
	    o.x=b.left+window.scrollX;
	    if(o.focusOutMode)
	    {
	        o.relatedControl.addEventListener("focusout",Popup.closeAll,false);
	        o.relatedControl.addEventListener("blur",Popup.closeAll,false);
	    }
	}
	else
	{
	  
	    o.x=Popup.mouseX;
	    o.y=Popup.mouseY;
	    if(o.x+o.dialog.offsetWidth>window.innerWidth)o.x=window.innerWidth-o.dialog.offsetWidth;
	    if(o.y+o.dialog.offsetHeight>window.innerHeight)o.y=window.innerHeight-o.dialog.offsetHeight;
	}
	o.dialog.style.top=o.y+"px";
	o.dialog.style.left=o.x+"px";
};
Popup.onKey=function(event)
{
	var p=Popup.activeObject;
	switch(event.keyCode)
	{
	    case 13://Enter
	        break;
	    case 27://ESC
	        break;
	    case 37://left
	        break;
	    case 38://up
	        break;
	    case 39://right
	        break;
	    case 40://down
	        break;
	}
};

function PopupItem(title,cmd,icon,tag)
{
	
	this.index=null;
	this.title=null;
	this.icon=null;
	this.command=null;
	this.popupIndex=null;
	this.dialog=null;
	this.tag=null;
this.title=title; this.command=cmd; this.icon=icon; this.tag=tag;
};




PopupItem.buildForm=function(o)
{
	if(!o.dialog)
	{
	    var li=document.createElement("li");
	    o.dialog=li;
	    if(o.icon)
	    {
	        var img=document.createElement("img");
	        img.src=o.icon;
	        li.appendChild(img);
	    }
	    if(o.title)
	    {
	        var span=document.createElement("span");
	        span.innerHTML=o.title;
	        li.appendChild(span);
	    }
	    //set onclick method
	    if(typeof(o.command)=="string")
	    {
	        li.setAttribute("onclick",o.command);
	    }
	    else if(typeof(o.command)!="undefined")
	    {
	        var cmd="PopupItem.runCommand("+o.popupIndex+","+o.index+")";
	        li.setAttribute("onclick",cmd);
	    }
	}
	return o.dialog;
};
PopupItem.runCommand=function(popupIndex,itemIndex)
{
	var item=Popup.list[popupIndex].items[itemIndex];
	item.command(item);
};
