---
title: Easy DP Problem
published: 2026-01-20
pinned: false
description: 2020浙江省赛E： 静态求解区间前k大的问题
tags:
  - 主席树
category: 题解
licenseName: CC BY
author: Rookiesama
draft: false
date: 2026-01-20
pubDate: 2026-01-20
---
+##  **问题理解与转化**

- **清晰的问题重述**：用简洁的语言描述问题
    
- **输入输出格式**：明确说明数据范围和格式要求
    
- **约束条件分析**：识别时间、空间限制等关键约束
    
- **问题转化**：将实际问题抽象为数学模型
## 1. 题目概述

给定序列 a1​,a2​,…,an​ 和 q 次查询，每次查询给出 li​,ri​,ki​，需计算以子序列 ali​​,ali​+1​,…,ari​​ 作为序列 b（长度 mi​=ri​−li​+1，且 bj​=ali​+j−1​）时，DP 状态 dp[mi​][ki​] 的值。

### DP 状态与转移方程

定义状态 dp[i][j]（0≤i,j≤m，m 为序列 b 的长度），转移规则：

- 当 i=0 时，dp[i][j]=0；
- 当 i>0 且 j=0 时，dp[i][j]=i2+dp[i−1][j]；
- 当 i>0 且 j>0 时，dp[i][j]=i2+max(dp[i−1][j],dp[i−1][j−1]+b[i])。

### 输入格式

1. 第一行：整数 T（测试用例数量，1≤T≤100）；
2. 每组用例：
    
    - 第一行：整数 n（序列 a 的长度，$1 \leq 10^5$）；
    - 第二行：n 个整数 a1​,a2​,…,an​（$1≤ai​≤10^6$）；
    - 第三行：整数 q（查询次数，$1≤q≤10^5$）；
    - 后续 q 行：每行三个整数 li​,ri​,ki​（$1≤li​≤ri​≤n，1≤ki​≤ri​−li​+1$）。
    

### 输出格式

每组用例输出 q 行，每行一个整数，表示对应查询的 dp[mi​][ki​] 值。

### 数据范围

- 所有测试用例的 n 之和不超过 5×105；
- 所有测试用例的 q 之和不超过 5×105。
### 样例说明

输入序列 a=[1,2,3,4,5]，三次查询分别为：

1. l=1,r=3,k=2 → 输出 19；
2. l=1,r=5,k=5 → 输出 70；
3. l=3,r=3,k=1 → 输出 4。

### 问题转换：
 - 题目本来是一个简单dp问题，$f[i][j]$ 可以由 $f[i - 1][j] + i^2$ 得来 也可以由 $f[i - 1][j - 1] + i^2 + b[i]$ 得来， 不难看出，其实题目的**dp与 $i^2$ 并无关系**，无论走哪条路，都存在$i^2$ ，计算 $f[mi][ki]$ 只需要**加上在 $b[i]$ 队列**中**最大的前k个**即可
### 难点:
 - 本题的难点是 $b[i]$ 的数组并不固定，是由 $a[i]$ 数组选定一个 $[L, R]$ 转变而来的, 
## 2. **核心思路阐述**

- **解题思路**：有个好消息是，$a[i]$ 数组的数据并没有发生任何变化, 这属于**静态问题**,那么我们可以想到用可持久化的数据结构来解决问题，创建$N$个不同状态的，再去查找在$[l,R]$ 之间的答案即可
    
- **关键观察点**：根据**问题转换**后，问题成功由计算$dp[mi][ki]$ 转变为计算 在 $bi-bj$ 中前 $ki$ 大之和即可。
    
- **思维过程**：我们需要 $[L,R]$ 中前 k 个值之和，若只是简单的查找并排序，则一定会超时 时间复杂度在 $O(q*n\log n)$ 左右，因此才会想到用**主席树**的方法 时空间复杂度都保持在 $O(n\log n)$ 左右, 由于要计算前k个数之和，故想到用**区间和快速计算**

## 3. **详细算法设计**

- **步骤分解**：
	- 先**预处理dp数组**，用来计算 $dp[r - l + 1]$  这个固定值
	- 在**数值上创建**第 0 版线段树，维护区间有多少数值，和数值之和,后插入的每一个 **$a[i]$ 都创建一版线段树**
	- 查找在 $[L, R]$ 版本之间的线段树-> 依据 $tr[R].cnt - tr[L].cnt$ 的值进行**树上二分查找** 到第大的数字，直接返回路径上所以的和就是前k大之和
    
- **数据结构**：本题存在**固定数据**但是**多种状态**的情况，因此使用主席树能更好的解决该类问题(虽然还有 划分树 和 树套树也能解决类似的问题)

## 4. **正确性证明**

### 验证逻辑的正确性
 - 在线段树中维护的是区间数值数量，$k \leq tr[l].cnt$ 第k大的数在左子树(区间)中就向左子树找，反之则向右子树找...以此类推一定能找到一个**第k大数就是该数值**

## 5. **复杂度分析**

- **时间复杂度**：$O((q + n)\log n)$ 每次操作时间复杂度在 $\log n$ 中总共 n + q 次操作
    
- **空间复杂度**：$O(n\log n)$ 初始线段树 + $n * \log n$ 创建的数量
    
- **实际性能**：600ms

## 6. **代码实现**
``` cpp
#include <bits/stdc++.h>

using namespace std;
#define int long long
#define IOS ios::sync_with_stdio(0), cin.tie(0), cout.tie(0)
#define x first
#define y second
#define endl "\n"
typedef signed long long LL;
typedef pair<int, int> PII;

const int N = 1e5 + 10;

class Node{
public:
    int l, r;
    int cnt, sum; // cnt 表示当前节点的子树中元素的个数， sum表示当前区间的元素和
};

Node tr[N * 4 + N * 18];
int n, m;
int dp[N], a[N];
int root[N], idx;
vector<int> nums;

int find(int x){
    return lower_bound(nums.begin(),nums.end(), x, greater<int>()) - nums.begin();
}

int build(int l, int r){
    int p = ++idx;
    if(l == r) {
        tr[p].cnt = tr[p].sum = 0;
        return p;
    }
    int mid = l + r >> 1;
    tr[p].l = build(l, mid), tr[p].r = build(mid + 1, r);
    tr[p].cnt = tr[p].sum = 0;
    return p;
}

int insert(int p, int l,int r, int x){
    int q = ++idx; //创建新节点
    tr[q] = tr[p]; //复制老节点
    if(l == r){ // 写错了, tr中的 l 和 r表示左右子树的指针, l, r才是左右端点
        tr[q].cnt++;
        tr[q].sum += nums[x];
        return q;
    }
    int mid = l + r >> 1;
    if(x <= mid) tr[q].l = insert(tr[p].l, l, mid , x ); //查找值在左半
    else tr[q].r = insert(tr[p].r, mid + 1, r, x); //查找值在右半
    tr[q].cnt = tr[tr[q].l].cnt + tr[tr[q].r].cnt;
    tr[q].sum = tr[tr[q].l].sum + tr[tr[q].r].sum;
    return q;
}

//所得到的就是 前 k 个最大的元素和
int query(int q, int p, int l, int r, int k){
    if(l == r)  return nums[l] * k; // 这里写错了，可能存在 k 小于 tr[q].cnt 的情况因此只能取剩余的k个
    int mid = l + r >> 1;
    int cnt = tr[tr[q].l].cnt - tr[tr[p].l].cnt; //计算左边区间数量
    if(cnt >= k) return query(tr[q].l, tr[p].l, l, mid, k);
    else return query(tr[q].r, tr[p].r, mid + 1, r, k - cnt) + tr[tr[q].l].sum - tr[tr[p].l].sum; // 左边元素和一定全部能加

}
void solve(){
    nums.clear();
    idx = 0;
    cin >> n;
    for(int i = 1; i <= n; i++) cin >> a[i], dp[i] = dp[i - 1] + i * i, nums.push_back(a[i]);
   sort(nums.begin(), nums.end(), greater<int>());
    nums.erase(unique(nums.begin(),nums.end()), nums.end());
    
    root[0] = build(0, nums.size() - 1);

    for(int i = 1; i <= n; i++){
        root[i] = insert(root[i - 1], 0, nums.size() - 1, find(a[i]));
    }

    cin >> m;
    while(m--){
        int l, r, k;
        cin >> l >> r >> k;
        //题目要求的是 以 ai 作为第一个 dp[mi][ki] 的值 dp的大小就是第 r - l + 1 个
        //在查找 前 k 个最大的元素和 时，需要注意的是，主席树维护的是区间内的数字数量和数字和
        cout << dp[r - l + 1] + query(root[r], root[l - 1], 0, nums.size() - 1, k) << endl; 
    }
}

signed main(){
    IOS;
    int _;
    cin >> _;
    while(_--){
        solve();
    }
}
```

## 7. **常见错误与陷阱**

- **易错点分析**：
  - 在类中 l r 表示左右子树的指针，而不是左右端点
  - 在其他函数中的 l 和 r 表示动态计算的左右端点
  - 在query中查找到的确是**第k大数**，但可能存在 k 小于 tr[q].cnt 的情况，因此只能取剩余的k个(犯了错)

```cpp
//所得到的就是 前 k 个最大的元素和
int query(int q, int p, int l, int r, int k){
    if(l == r)  return nums[l] * k; // 这里写错了，可能存在 k 小于 tr[q].cnt 的情况因此只能取剩余的k个
    int mid = l + r >> 1;
    int cnt = tr[tr[q].l].cnt - tr[tr[p].l].cnt; //计算左边区间数量
    if(cnt >= k) return query(tr[q].l, tr[p].l, l, mid, k);
    else return query(tr[q].r, tr[p].r, mid + 1, r, k - cnt) + tr[tr[q].l].sum - tr[tr[p].l].sum; // 左边元素和一定全部能加

}
```
    
### 常见错误
  - 在**从大到小**的vector中，想用**lower_bound查找**比 x 大的第一个数得用 
    `greater<int>()`比较函数,否则只会找**第一个大于**x的值


## 8. **拓展与变种**

- **相关问题**：[[第k小数]]
    
- **变种问题**：暂无了解
    
- **实际应用**：**处理可持续化 / 多状态 / 静态的问题**

## 9. **总结与收获**

### 总结: 一道不错的主席树综合题
### 核心知识点：[[主席树]]

### 思维模式: 静态 / 多状态 / 可持续化 / 降维度

### 学习建议: 这样的数据结构题目，需要以题目数量为基础，打下扎实的基本功，才能在赛场中快速的写出
