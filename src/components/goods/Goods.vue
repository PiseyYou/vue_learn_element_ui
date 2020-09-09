<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
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
            <el-button type="primary" size="mini" icon="el-icon-edit" @click="editDialog(scope.row.attr_id)">编辑</el-button>
            <el-button type="danger" size="mini" icon="el-icon-delete" @click="removeParams(scope.row.attr_id)">删除</el-button>
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
      <el-form :model="goodsForm" :rules="goodsFormRules" ref="goodsFormRef" label-width="100px" class="demo-ruleForm">
        <el-form-item label="商品名称" prop="goodsName"> <el-input v-model="goodsForm.goodsName"></el-input></el-form-item>
        <el-form-item label="商品价格" prop="goodsPrice"> <el-input v-model="goodsForm.goodsPrice"></el-input></el-form-item>
        <el-form-item label="商品重量" prop="goodsWeight"> <el-input v-model="goodsForm.goodsWeight"></el-input></el-form-item>
        <el-form-item label="商品数量" prop="goodsNumber"> <el-input v-model="goodsForm.goodsNumber"></el-input></el-form-item>
        <el-form-item label="商品介绍" prop="goodsIntroduce"> <el-input v-model="goodsForm.goodsIntroduce"></el-input></el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
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
      goodsForm: {},
      goodsFormRules: {
        goodsName: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
        goodsPrice: [{ required: true, message: '请输入商品价格', trigger: 'blur' }],
        goodsNumber: [{ required: true, message: '请输入商品数量', trigger: 'blur' }],
        goodsWeight: [{ required: true, message: '请输入商品重量', trigger: 'blur' }],
        goodsIntroduce: [{ required: true, message: '请输入商品介绍', trigger: 'blur' }]
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
        this.$message.error('商品列表获取失败')
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
    async editDialog(attrId) {
      this.editDialogVisible = true
      const { data: res } = await this.$http.put(`goods/${attrId}`, { params: this.goodInfo })
      if (res.meta.status !== 200) {
        this.$message.error('获取商品失败')
      }
      this.$message.success('获取商品成功')
      // this.goodsForm = res.data
      this.goodsForm.goodsName = res.data.goods_name
      this.goodsForm.goodsPrice = res.data.goods_price
      this.goodsForm.goodsNumber = res.data.goods_number
      this.goodsForm.goodsWeight = res.data.goods_weight
      this.goodsForm.goodsIntroduce = res.data.goods_introduce
    },
    editDialogClosed() {
      this.$refs.goodsFormRef.resetFields()
    },
    goAddpage() {
      this.$router.push('/goods/add')
    }
  }
}
</script>
<style lang="less" scoped></style>
