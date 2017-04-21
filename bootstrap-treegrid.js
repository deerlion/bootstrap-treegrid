/**
 * Created by lihaitao on 2017/4/18.
 */
!function ($) {

    'use strict';

    var s="";
    $.extend($.fn.bootstrapTable.defaults, {
        treeGrid: false
    });

    var BootstrapTable = $.fn.bootstrapTable.Constructor;
    //递归数据
    BootstrapTable.prototype.drowRowData = function (rows, cols, level, pid) {
        var folderColumnIndex =  0;
        if(this.options.treeGrid){
            for (var i = 0; i < rows.length; i++) {
                var id = pid + "_" + i; //行id
                var row = rows[i];

                s += "<tr id='TR" + id + "' data-pid='" + ((pid == "") ? "0" : ("TR" + pid)) + "' data-open='Y' >";
                for (var j = 0; j < cols.length; j++) {
                    var col = cols[j];
                    s += "<td align=left";

                    //层次缩进
                    if (j == folderColumnIndex) {
                        s += " style=text-indent:" +(parseInt("14") * (level - 1)) + "px;'> ";
                    } else {
                        s += ">";
                    }

                    //节点图标
                    if (j == folderColumnIndex) {
                        if (row.children) { //有下级数据
                            s += "<span  data-folder='Y' data-trid='TR" + id + "'>▾</span>";
                        } else {
                            s += "";
                        }
                    }

                    s += (row[col] || "") + "</td>";
                }
                s += "</tr>";

                //递归显示下级数据
                if (row.children) {
                    this.drowRowData(row.children, cols, level + 1, id);
                }
            }
        }

    };

    BootstrapTable.prototype.initBody = function () {
        s="";
        //递归显示数据行
        var rows = this.options.data;
        var cols = this.header.fields;
        this.$body = this.$el.find('>tbody');
        if (!this.$body.length) {
            this.$body = $('<tbody></tbody>').appendTo(this.$el);
        };
        this.drowRowData(rows, cols, 1, "");
        this.$body.html(s);
        this.expand();
        this.expandAll('N')
    };
    //显示或隐藏子节点数据
    BootstrapTable.prototype.showHiddenNode = function (trid, open) {
        var root=this.$el;
        if (open == "N") { //隐藏子节点
            root.find("#" + trid).find("span[data-folder='Y']").text("▸");
            root.find("tr[id^=" + trid + "_]").css("display", "none");
        } else { //显示子节点
            root.find("#" + trid).find("span[data-folder='Y']").text("▾");
            this.showSubs(trid);
        }
    }

    //递归节点是否需要显示
    BootstrapTable.prototype.showSubs = function (trid) {
        var root=this.$el;
        var isOpen = root.find("#" + trid).attr("data-open");
        if (isOpen == "Y") {
            var trs = root.find("tr[data-pid=" + trid + "]");
            trs.css("display", "");

            for (var i = 0; i < trs.length; i++) {
                this.showSubs(trs[i].id);
            }
        }
    }
    //显示或者隐藏节点
    BootstrapTable.prototype.expand=function () {
        var root=this.$el;
        var that=this;
        root.find("span[data-folder='Y']").bind("click", function () {
            var trid = $(this).attr("data-trid");
            var isOpen = root.find("#" + trid).attr("data-open");

            isOpen = (isOpen == "Y") ? "N" : "Y";
            root.find("#" + trid).attr("data-open", isOpen);
            that.showHiddenNode(trid, isOpen);
        });
    }
    //展开或收起所有节点
    BootstrapTable.prototype.expandAll = function (isOpen) {
        var root=this.$el;
        var trs = root.find("tr[data-pid='0']");
        for (var i = 0; i < trs.length; i++) {
            var trid = trs[i].id || trs[i].getAttribute("id");
            this.showHiddenNode(trid, isOpen);
        }
    }


}(jQuery);