<template>
  <div class="pos">
    <el-row>
      <el-col
        :span="7"
        id="order-list"
        class="order-pos"
      >
        <el-table
          :data="tableData"
          border
          show-summary
          style="width: 100%"
        >
          <el-table-column
            prop="goodsName"
            label="商品"
          ></el-table-column>
          <el-table-column
            prop="count"
            label="量"
            width="50"
          ></el-table-column>
          <el-table-column
            prop="price"
            label="金额"
            width="70"
          ></el-table-column>
          <el-table-column
            label="操作"
            width="100"
            fixed="right"
          >
            <template scope="scope">
              <el-button
                type="text"
                size="small" @click="delSingleGoods(scope.row)"
              >删除</el-button>
              <el-button
                type="text"
                size="small" @click="addOrderList(scope.row)"
              >增加</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-button type="warning">挂单</el-button>
        <el-button type="danger" @click="delAllGoods()">删除</el-button>
        <el-button type="success" @click="checkout()">结账</el-button>

      </el-col>
      <el-col :span="17">
        <div class="often-goods">
          <div class="title">常用商品</div>
          <div class="often-goods-list">
            <ul>
              <li
                v-for="(item, index) in oftenGoods"
                :key="index" @click="addOrderList(item)"
              >
                <span>{{item.goodsName}}</span>
                <span class="o-price">￥{{item.price}}元</span>
              </li>
            </ul>
          </div>
        </div>
        <div class="goods-type">
          <el-tabs>
            <el-tab-pane label="汉堡">
              <ul class='cookList'>
                <li
                  v-for="(goods,index) in type0Goods"
                  :key="index" @click="addOrderList(goods)"
                >
                  <span class="foodImg"><img
                      :src="goods.goodsImg"
                      width="100%"
                    ></span>
                  <span class="foodName">{{goods.goodsName}}</span>
                  <span class="foodPrice">￥{{goods.price}}元</span>
                </li>
              </ul>
            </el-tab-pane>
            <el-tab-pane label="小食">
               <ul class='cookList'>
                <li
                  v-for="(goods,index) in type1Goods"
                  :key="index" @click="addOrderList(goods)"
                >
                  <span class="foodImg"><img
                      :src="goods.goodsImg"
                      width="100%"
                    ></span>
                  <span class="foodName">{{goods.goodsName}}</span>
                  <span class="foodPrice">￥{{goods.price}}元</span>
                </li>
              </ul>
            </el-tab-pane>
            <el-tab-pane label="饮料">
               <ul class='cookList'>
                <li
                  v-for="(goods,index) in type2Goods"
                  :key="index" @click="addOrderList(goods)"
                >
                  <span class="foodImg"><img
                      :src="goods.goodsImg"
                      width="100%"
                    ></span>
                  <span class="foodName">{{goods.goodsName}}</span>
                  <span class="foodPrice">￥{{goods.price}}元</span>
                </li>
              </ul>
            </el-tab-pane>
            <el-tab-pane label="套餐">
               <ul class='cookList'>
                <li
                  v-for="(goods,index) in type3Goods"
                  :key="index" @click="addOrderList(goods)"
                >
                  <span class="foodImg"><img
                      :src="goods.goodsImg"
                      width="100%"
                    ></span>
                  <span class="foodName">{{goods.goodsName}}</span>
                  <span class="foodPrice">￥{{goods.price}}元</span>
                </li>
              </ul>
            </el-tab-pane>
          </el-tabs>
        </div>

      </el-col>
    </el-row>

  </div>
</template>
<script>
export default {
  name: "Pos",
  mounted(){
    var orderHeight = document.body.clientHeight;
    document.getElementById("order-list").style.height = orderHeight + "px";
  },
  created(){
    this.$fetch('/kuaican/oftenGoods')
    .then((response) => {
        this.oftenGoods=response;
    })
    this.$fetch('/kuaican/typeGoods')
    .then((response) => {
        // this.oftenGoods=response;
        //  console.log(response);
          this.type0Goods=response[0];
         this.type1Goods=response[1];
         this.type2Goods=response[2];
         this.type3Goods=response[3];
    })
  },
  data() {
    return {
      totalCount:0,
      totalMoney:0,
      tableData: [],
      oftenGoods: [],
      type0Goods: [],
      type1Goods: [],
      type2Goods: [],
      type3Goods: [],
    }
  },
  methods: {
    addOrderList(goods){
      let isHave = false;
      if(this.tableData.length){
        isHave = this.tableData.some(o =>o.goodsId == goods.goodsId);
      }
      if(isHave){
        let arr = this.tableData.filter(o =>o.goodsId == goods.goodsId);
        arr[0].count++
      }else{
        let newGoods ={goodsId:goods.goodsId,goodsName:goods.goodsName,price:goods.price,count:1};
        this.tableData.push(newGoods);
      }
      // 进行数量和价格的汇总计算
      this.tableData.forEach((element)=>{
        this.totalCount +=element.count;
        this.totalMoney = this.totalMoney +(element.price*element.count)
      })
      
    },
    delSingleGoods(goods){
      let arr = this.tableData.filter(o =>o.goodsId == goods.goodsId);
      if(arr[0].count--==1){
        this.tableData = this.tableData.filter(o=>o.goodsId!=goods.goodsId)
      }
    },
    delAllGoods() {
      this.tableData = [];
      this.totalCount = 0;
      this.totalMoney = 0;
    },
    // 结账
    checkout() {
      if(this.totalCount){
        this.$message({
            message: '结账成功，感谢你又为店里出了一份力!',
            type: 'success'
        })
        this.delAllGoods();
      }else{
        this.$message.error('不能空结。老板了解你急切的心情！');
      }

    }
    
  },
}
</script>


<style scoped>
.order-pos {
  border-right: 1px solid #c0ccda;
}
.often-goods-list > ul > li {
  list-style: none;
  float: left;
  border: 1px solid #e5e9f2;
  padding: 10px;
  margin: 5px;
  background-color: #fff;
}
.o-price {
  color: #58b7ff;
}

.title {
  height: 20px;
  border-bottom: 1px solid #d3dce6;
  background-color: #f9fafc;
  padding: 10px;
}
.goods-type {
  clear: both;
}

.cookList li {
  list-style: none;
  width: 23%;
  border: 1px solid #e5e9f2;
  height: auot;
  overflow: hidden;
  background-color: #fff;
  padding: 2px;
  float: left;
  margin: 2px;
}
.cookList li span {
  display: block;
  float: left;
}
.foodImg {
  width: 40%;
}
.foodName {
  font-size: 18px;
  padding-left: 10px;
  color: brown;
}
.foodPrice {
  font-size: 16px;
  padding-left: 10px;
  padding-top: 10px;
}
</style>