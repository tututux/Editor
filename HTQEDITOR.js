HTQEditor = function () {
    var defaults = { //定义默认工具栏
        toolbar: [
            'title',
            'bold',
            'italic',
            'underline',
            'strikethrough',
            'font',
            'color',
            'ol',
            'ul',
            'link',
            'image',
            'hr',
            'indent',
            'outdent',
            'align_left',
            'align_center',
            'align_right'],
        imgUploader: "",
    }
    var BUTTON_COMMAND = { //定义按钮命令
        title: { command: "formatBlock", hint: "Title" },
        bold: { command: "bold", hint: "Bold" },
        italic: { command: "italic", hint: "Italic" },
        underline: { command: "underline", hint: "Underline" },
        strikethrough: { command: "strikethrough", hint: "Strikethrough" },
        font: { command: "fontSize", hint: "Font Size" },
        color: { command: "foreColor", hint: "Font Color" },
        ol: { command: "insertOrderedList", hint: "Ordered List" },
        ul: { command: "insertUnorderedList", hint: "Unordered List" },
        link: { command: "createLink", hint: "Link" },
        image: { command: "insertImage", hint: "Insert Image" },
        hr: { command: "insertHorizontalRule", hint: "Horizontal Line" },
        indent: { command: "indent", hint: "Indent" },
        outdent: { command: "outdent", hint: "Outdent" },
        align_left: { command: "justifyLeft", hint: "Align Left" },
        align_center: { command: "justifyCenter", hint: "Align Center" },
        align_right: { command: "justifyRight", hint: "Align Right" }
    }
    var editorDocument=null; //文档为空
    var toolBar= null; //工具栏为空
    this.init = function (element, settings) {//编辑器的节点选择 和 编辑器初始配置
        if (settings) {
            settings.toolbar ? defaults.toolbar = settings.toolbar : "";
            settings.imgUploader ? defaults.imgUploader = settings.toolbar : "";
        }

        var targetEle = document.getElementById(element);


        createEditor(targetEle);
    }
    function createEditor(targetEle) {//创建编辑器
        var container = document.createElement("div"); //创建一个div容齐
        container.className = "htqeditor"            //容器类名
        targetEle.style.display = "none";           //让原本的节点隐藏
        targetEle.parentNode.insertBefore(container, targetEle);//在原本节点前插入容器

        toolBar = generateToolBar(container);          //生成工具栏
        editorBody = generateBody(container);            //生成body
    }
    function generateToolBar(container) {//生成工具栏
        var toolBarEle = document.createElement("ul"); //创建一个工具栏节点
        toolBarEle.className = "htqeditor_tools"  //工具栏类名
        var toolBarItemsHTML = [];                 //工具
        var color = ['#000','#2F4F4F','#BEBEBE','#0000CD','#00BFFF','#00FA9A','#6B8E23','#B22222','#8B4513','#f00','#EEC591','#551A8B']
        var h=['h1','h2','h3','h4','h5']
        
       
        for (var i = 0; i < defaults.toolbar.length; i++) {     //遍历工具 每一个push一个li
            var button = defaults.toolbar[i];
            switch (defaults.toolbar[i]) {
                case 'font':
                    var fontSize = `<div class='fontsize configbox'><ul><li class='fontbig' size='8'>Aa</li><li class='fontmid' size='5'>Aa</li><li class='fontsma' size='3'>Aa</li></ul></div>`
                    toolBarItemsHTML.push(`<li class='${defaults.toolbar[i]}'>${fontSize}<a herf='javascript:;' title='` + BUTTON_COMMAND[button].hint + "' data-param='" + BUTTON_COMMAND[button].command + "'><span class='htqeditor_icon htqeditor_icon_" + button + "'></span></a></li>");
                    break;
                case 'color':
                    var colordom = ''
                    color.map(item=>{ colordom+=`<li style="background:${item}"></li>` })
                    colordom=`<div class='fontcolor configbox'><ul>${colordom}</ul></div>`
                    toolBarItemsHTML.push(`<li class='${defaults.toolbar[i]}'>${colordom}<a herf='javascript:;' title='` + BUTTON_COMMAND[button].hint + "' data-param='" + BUTTON_COMMAND[button].command + "'><span class='htqeditor_icon htqeditor_icon_" + button + "'></span></a></li>");
                    break;
                case 'title':
                    var hdom=''
                    h.map((item,index)=>{ hdom +=`<li title='${item}'">Heading${index+1}</li>`})
                    hdom=`<div class='htitle configbox'><ul>${hdom}</ul></div>`
                    toolBarItemsHTML.push(`<li class='${defaults.toolbar[i]}'>${hdom}<a herf='javascript:;' title='` + BUTTON_COMMAND[button].hint + "' data-param='" + BUTTON_COMMAND[button].command + "'><span class='htqeditor_icon htqeditor_icon_" + button + "'></span></a></li>");
                    break;
                default:
                    toolBarItemsHTML.push(`<li class='${defaults.toolbar[i]}'><a herf='javascript:;' title='` + BUTTON_COMMAND[button].hint + "' data-param='" + BUTTON_COMMAND[button].command + "'><span class='htqeditor_icon htqeditor_icon_" + button + "'></span></a></li>");
                    break;
            }
        }
        toolBarEle.innerHTML = toolBarItemsHTML.join("");//将数组转为字符串
        container.appendChild(toolBarEle); //插入到div容器中
        bindButtonAction(toolBarEle);//绑定按钮事件
        return toolBarEle;
    }
    function generateBody(container) {//生成一个iframe
        var iframe = document.createElement("iframe");//创建iframe
        iframe.style.width = "100%";
        iframe.style.height = "300px";
        iframe.frameBorder = 0;
        container.appendChild(iframe);//插入到div容器中
        var iframeDocument = iframe.contentDocument || iframe.contentWindow.document;//兼容
        iframeDocument.designMode = "on";//把 document 改成可编辑状态
        iframeDocument.open();//在iframe中添加标签
        iframeDocument.write('<html><head></head><body bgcolor="#fff"></body></html>');
        iframeDocument.close();
        editorDocument = iframeDocument;//iframe document

        iframeDocument.onclick=function(e){ 
            getStyle.bind(this)(e)
        }
        iframeDocument.onkeyup=function(e){
            getStyle.bind(this)(e)
        }
        return iframe;
    }
    function bindButtonAction(toolBarEle) {//绑定按钮事件
        var buttons = toolBarEle.getElementsByTagName("a");
        for (var i = 0; i < buttons.length; i++) {
            buttons[i].onclick = normalBtnAction.bind(buttons[i]);
        }

    }
    function normalBtnAction(){//获取按钮参数
        var command = this.getAttribute("data-param");//获取按钮上的自定义属性
        switch (command) {
            case 'fontSize':
                var size = document.getElementsByClassName('fontsize')[0];
                size.style.display='block';
                size.onclick=function(e){
                    editorDocument.execCommand(command,true,e.target.getAttribute('size'));
                    size.style.display='none';
                }
                size.onmouseleave=function(){
                    size.style.display='none';
                }
                break;
            case 'foreColor':
                var color = document.getElementsByClassName('fontcolor')[0];
                color.style.display='block';
                color.onclick=function(e){
                    editorDocument.execCommand(command,true,e.target.style.background);
                    color.style.display='none';
                }
                color.onmouseleave=function(){
                    color.style.display='none';
                }
                break;
            case 'formatBlock':
                var h = document.getElementsByClassName('htitle')[0];
                h.style.display='block';
                h.onclick=function(e){
                    editorDocument.execCommand(command,true,e.target.getAttribute('title'));
                    h.style.display='none';
                }
                h.onmouseleave=function(){
                    h.style.display='none';
                }
                break;
            default:
                editorDocument.execCommand(command);
                break;
        }
    }
    function getRange(){//获取光标元素
        if(window.getSelection){
            return this.getSelection().getRangeAt(0)
        }else if(this.selection && this.selection.createRange){
            return this.selection.createRange().text
        }
    }
    function getStyle(e){//获取字体样式
        let el =getRange.bind(this)().commonAncestorContainer.parentElement
        let elp =getRange.bind(this)().commonAncestorContainer.parentElement.parentElement||''
        let font = document.defaultView.getComputedStyle(el,null).getPropertyValue('font')
        let text = document.defaultView.getComputedStyle(el,null).getPropertyValue('text-decoration')
        let color = document.defaultView.getComputedStyle(el,null).getPropertyValue('color')
        if(elp)text += document.defaultView.getComputedStyle(elp,null).getPropertyValue('text-decoration')
        let li = document.defaultView.getComputedStyle(el,null).getPropertyValue('list-style-type')
        // let all = document.defaultView.getComputedStyle(el,null)
        let Bold = font.indexOf('700')===-1?false:'Bold'
        let Italic = font.indexOf('italic')===-1?false:'Italic'
        let Underline = text.indexOf('underline')===-1?false:'Underline'
        let Strikethrough = text.indexOf('line-through')===-1?false:'Strikethrough'
        let Decimal = li.indexOf('decimal')===-1?false:'Ordered List'
        let fontcolor =color!=='rgb(0, 0, 0)'?'Font Color':''
        // let path = Array.from(e.path.slice(0,e.path.length-4))
        // let li =''
        // path.map(item=>{
        //    li =  item.nodeName.indexOf('OL')!==-1?'Ordered List':item.nodeName.indexOf('UL')!==-1?'Unordered List':''
        // })

        setStyle([Bold,Italic,Underline,Strikethrough,Decimal,fontcolor])
    }
    function setStyle(arr){//设置工具栏样式
        var buttons = document.getElementsByTagName("a");
        buttons=Array.from(buttons)
        for(var i = 0;i<buttons.length;i++){
            for(var j =0;j<arr.length;j++){
                if(buttons[i].title===arr[j]){
                    buttons[i].className='active'
                    buttons.splice(i,1)
                }else{
                    buttons[i].className=''
                }
            }
        }
    }
}
