<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getGoodsList">
            <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="goAddpage"> 添加商品 </el-button>
        </el-col>
      </el-row>
      <el-table :data="goodslist" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="goods_name" label="商品名称"> </el-table-column>
        <el-table-column prop="goods_price" label="商品价格" width="150px"> </el-table-column>
        <el-table-column prop="goods_weight" label="商品重量" width="100px"> </el-table-column>
        <el-table-column prop="add_time" label="创建时间" width="150">
          <template slot-scope="scope">
            {{ scope.row.add_time | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" icon="el-icon-edit" @click="showEditDialog(scope.row.goods_id)">编辑</el-button>
            <el-button type="danger" size="mini" icon="el-icon-delete" @click="removeParams(scope.row.goods_id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 20, 30]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <el-dialog title="商品编辑" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
      <el-form :model="editGoodsForm" :rules="editGoodsFormRules" ref="editGoodsFormRef" label-width="100px" class="demo-ruleForm">
        <el-form-item label="商品名称" prop="goodsName">
          <el-input v-model="editGoodsForm.goods_name"></el-input>
        </el-form-item>
        <el-form-item label="商品价格" prop="goodsPrice">
          <el-input v-model="editGoodsForm.goods_price"></el-input>
        </el-form-item>
        <el-form-item label="商品重量" prop="goodsWeight">
          <el-input v-model="editGoodsForm.goods_weight"></el-input>
        </el-form-item>
        <el-form-item label="商品数量" prop="goodsNumber">
          <el-input v-model="editGoodsForm.goods_number"></el-input>
        </el-form-item>
        <el-form-item label="商品介绍" prop="goodsIntroduce">
          <el-input v-model="editGoodsForm.goods_introduce"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <!-- <el-button type="primary" @click="dialogVisible = false">确 定</el-button> -->
        <el-button type="primary" @click="editGoodInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      goodslist: [],
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      total: 0,
      editDialogVisible: false,
      goodInfo: {
        goodsName: 'test_goods_name2',
        goodsPrice: 20,
        goodsNumber: 30,
        goodsWeight: 40,
        goodsIntroduce: 'abc',
        pics: [],
        attrs: []
      },
      editGoodsForm: {},
      editGoodsFormRules: {
        goods_name: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
        goods_price: [{ required: true, message: '请输入商品价格', trigger: 'blur' }],
        goods_number: [{ required: true, message: '请输入商品数量', trigger: 'blur' }],
        goods_weight: [{ required: true, message: '请输入商品重量', trigger: 'blur' }],
        goods_introduce: [{ required: true, message: '请输入商品介绍', trigger: 'blur' }]
      }
    }
  },

  created() {
    this.getGoodsList()
  },

  methods: {
    async getGoodsList() {
      const { data: res } = await this.$http.get('goods', { params: this.queryInfo })
      if (res.meta.status !== 200) {
        return this.$message.error('商品列表获取失败')
      }
      this.$message.success('商品列表获取成功')
      this.queryInfo.pagenum = res.data.pagenum - 0
      this.total = res.data.total
      this.goodslist = res.data.goods
    },
    // getGoodsList() {
    //   this.getGoodsList()
    // },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getGoodsList()
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getGoodsList()
    },
    async showEditDialog(id) {
      const { data: res } = await this.$http.get('goods/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('查询商品信息失败')
      }
      this.$message.success('查询商品信息成功')
      // console.log('res的信息为', res)
      this.editGoodsForm = res.data
      this.editDialogVisible = true
    },

    async editGoodInfo() {
      // console.log('attrId的值为', attrId)
      this.$refs.editGoodsFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put(`goods/${this.editGoodsForm.goods_id}`, {
          goods_name: this.editGoodsForm.goods_name,
          goods_price: this.editGoodsForm.goods_price,
          goods_number: this.editGoodsForm.goods_number,
          goods_weight: this.editGoodsForm.goods_weight,
          goods_introduce: this.editGoodsForm.goods_introduce,
          goods_cat: this.editGoodsForm.goods_cat
          // goods_cat: ''
          // pics: this.editGoodsForm.pics,
          // attrs: this.editGoodsForm.attrs
        })
        if (res.meta.status !== 200) {
          // console.log('editGoodsForm的信息为', this.editGoodsForm)
          // console.log('res的值为', res)
          return this.$message.error('修改商品失败')
        }
        this.$message.success('修改商品成功')
        // this.goodsForm = res.data
        this.editGoodsForm.goods_name = res.data.goods_name
        this.editGoodsForm.goods_price = res.data.goods_price
        this.editGoodsForm.goods_number = res.data.goods_number
        this.editGoodsForm.goods_weight = res.data.goods_weight
        this.editGoodsForm.goods_introduce = res.data.goods_introduce
        this.editDialogVisible = false
      })

      // const { data: res } = await this.$http.put(`goods/${attrId}`, { params: this.goodInfo })
      // const { data: res } = await this.$http.put(`goods/${attrId}`, form)
      // if (res.meta.status !== 201) {
      //   console.log('res的值为', res)
      //   return this.$message.error('获取商品失败')
      // }
      // this.$message.success('获取商品成功')
      // // this.goodsForm = res.data
      // this.goodsForm.goodsName = res.data.goods_name
      // this.goodsForm.goodsPrice = res.data.goods_price
      // this.goodsForm.goodsNumber = res.data.goods_number
      // this.goodsForm.goodsWeight = res.data.goods_weight
      // this.goodsForm.goodsIntroduce = res.data.goods_introduce
    },
    editDialogClosed() {
      this.$refs.editGoodsFormRef.resetFields()
    },
    goAddpage() {
      this.$router.push('/goods/add')
    }
  }
}
</script>
<style lang="less" scoped></style>
