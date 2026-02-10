---
title: 第K小数查询问题
published: 2026-01-20
pinned: false
description: 算法题解：区间第K小数查询，主席树
tags:
  - 主席树
  - 区间查询
category: 题解
licenseName: CC BY
author: Rookiesama
draft: false
date: 2026-01-20
pubDate: 2026-01-20
---

# 第K小数查询问题

## 一、核心任务

给定一个长度为 $N$ 的整数序列（下标 $1\sim N$），执行 $M$ 次查询操作，每次查询需输出序列中指定下标区间 $[l_i, r_i]$ 内第 $k_i$ 小的数值。

> **说明**："第 $k$ 小" 指将区间内的数从小到大排序后，位于第 $k$ 个位置的数。

## 二、输入输出要求

### 1. 输入格式

- **第一行**：两个整数 $N$（序列长度）、$M$（查询次数）。
- **第二行**：$N$ 个整数，构成序列 $A$（元素绝对值 $\leq 10^9$）。
- **接下来 $M$ 行**：每行三个整数 $l_i, r_i, k_i$，表示查询区间 $[l_i, r_i]$ 内的第 $k_i$ 小数。

### 2. 输出格式

对每次查询，输出一行一个整数，即该次查询对应的第 $k_i$ 小数值。

## 三、数据范围

| 参数   | 范围               |
| ---- | ---------------- |
| 序列长度 | $N \leq 10^5$    |
| 查询次数 | $M \leq 10^4$    |
| 序列元素 | $A[i] \leq 10^9$ |

## 四、样例核心提炼

**输入序列**：$[1,5,2,6,3,7,4]$

**三次查询**：

1. **查询区间 $[2,5]$**（元素：$5, 2, 6, 3$）的第 3 小：
   - 排序后：$[2, 3, 5, 6]$
   - 第 3 小：**5**

2. **查询区间 $[4,4]$**（元素：$6$）的第 1 小：
   - 结果：**6**

3. **查询区间 $[1,7]$**（完整序列）的第 3 小：
   - 排序后：$[1, 2, 3, 4, 5, 6, 7]$
   - 第 3 小：**3**

**输出结果**：$5\ 6\ 3$（与样例输出一致）

## 五、约束条件分析

1. **数据量大**：若直接暴力排序,时间复杂度为$O(NM\log N)$，并不可取，因此需选择其他算法。
2. **数据范围大**： 应当采用离散的方式存储序列元素，将其映射到 $[1, N]$ 的整数范围。

## 六、题解思路

1. **算法选择理由**:
  - 我们选择主席树来解决
    - [[主席树]]是用来解决静态问题的，即查询区间固定，修改操作很少的情况。
    - 同时主席树算法可以查询以前任意版本的序列，因此可以在$O(\log N)$的时间内查询出$[L, R]$区间内的第K小数。
    - 单个数据操作时间: $O(\log N)$ 总时间为$O((N + M)\log N)$
    - 空间复杂度: $O(N\log N)$
  
2. **实现细节**
  - 我们先将序列元素[[离散化]]，将其映射到 $[1, N]$ 的整数范围。
  - 建树：我们在**离散后的数值**上建树，主席树维护区间中有多少数字
```cpp
// 建树 这里的l 和 r表示左右边界
int build(int l, int r){
    int p = ++idx;
    if(l == r) return p;
    int mid = l + r >> 1;
    tr[p].l = build(l, mid), tr[p].r = build(mid + 1, r);
    return p;
}
```
  - 由于题目要求**第k小数**可以用树上二分快速查询 -> 查找在数值上是第k个数（及第k小数） 就是我们要的答案
  - 插入新值更新：由于我们每次插入一个值，都是全新版本，因此需要再欸外开创($\log N$)的空间, 更新以上一个版本为基底的全新版版本
```cpp
// 插入新的点 创建 logn 大小数组
int insert(int p,int l, int r, int x){
    int q = ++idx; // q 表示新点， p 表示旧点
    tr[q] = tr[p];
    if(l == r) {
        tr[q].cnt ++;
        return q;
    }
    int mid = l + r >> 1;
    if(x <= mid) tr[q].l = insert(tr[p].l, l, mid, x); // 进入原先创建的树中，导入值,并更新新的值Node
    else tr[q].r = insert(tr[p].r, mid + 1, r, x );
    tr[q].cnt = tr[tr[q].l].cnt + tr[tr[q].r].cnt;
    return q;
}
```
  - 查找细节： 在区间中的数字数量 cnt >= k 则说明 第k小数在区间左侧，反之则在区间右侧，同时要注意版本在$[L, R]$ 之间，因此**计算区间数量要减去 L - 1 版本的区间数量**,即：$cnt[R] - cnt[L - 1]$

```cpp
//查找 在版本 L ~ R 之间 第 k 小的数字
// q 为新版本，p 为老版本
int query(int q, int p,int l, int r,int k){
    if(l == r) return r;
    int cnt = tr[tr[q].l].cnt - tr[tr[p].l].cnt; // 在 版本为 L R 之间
    int mid = l + r >> 1;
    if(k <= cnt) return query(tr[q].l, tr[p].l, l ,mid, k);
    else return query(tr[q].r, tr[p].r, mid + 1, r, k - cnt); //整个区间的第k小数等于k - 左边去区间的数量
}
```

1. **创建主席树的注意点**
  - 我们创建的类中有一下元素:
    - l 左子树指针
    - r 右子树指针
    - cnt 区间内数字数量
  - 我们不再给左右边界，而是在查询时动态计算
  - 创建的空间大小应该是: $N * 4 + N * \log N$ (**线段树基本大小 N * 4 + N 次操作每次修改 logN 的空间**)
  
```cpp
  class Node{
public:
    int l, r;// 不再表示左右边界，而是左右子树
    int cnt;
};
// 线段树基本大小 N * 4 + N 次操作每次修改 logN 的空间
Node tr[N * 4 + N * 17];  
```

## 七、代码实现

```cpp
#include <bits/stdc++.h>

using namespace std;
#define int long long
#define IOS ios::sync_with_stdio(0), cin.tie(0), cout.tie(0)
#define x first
#define y second
#define endl "\n"
typedef signed long long LL;
typedef pair<int, int> PII;

const int N = 1e5 + 10, M = 1e4 + 10;

int n, m;
int a[N];
vector<int> nums; //离散化

class Node{
public:
    int l, r;// 不再表示左右边界，而是左右子树
    int cnt;
};
// 线段树基本大小 N * 4 + N 次操作每次修改 logN 的空间
Node tr[N * 4 + N * 17];  

//总共有 N 个版本
int root[N], idx; 

// 离散化查找
int find(int x){
    return lower_bound(nums.begin(),nums.end(), x) - nums.begin();
}

// 建树 这里的l 和 r表示左右边界
int build(int l, int r){
    int p = ++idx;
    if(l == r) return p;
    int mid = l + r >> 1;
    tr[p].l = build(l, mid), tr[p].r = build(mid + 1, r);
    return p;
}

// 插入新的点 创建 logn 大小数组
int insert(int p,int l, int r, int x){
    int q = ++idx; // q 表示新点， p 表示旧点
    tr[q] = tr[p];
    if(l == r) {
        tr[q].cnt ++;
        return q;
    }
    int mid = l + r >> 1;
    if(x <= mid) tr[q].l = insert(tr[p].l, l, mid, x); // 进入原先创建的树中，导入值,并更新新的值Node
    else tr[q].r = insert(tr[p].r, mid + 1, r, x );
    tr[q].cnt = tr[tr[q].l].cnt + tr[tr[q].r].cnt;
    return q;
}

//查找 在版本 L ~ R 之间 第 k 小的数字
// q 为新版本，p 为老版本
int query(int q, int p,int l, int r,int k){
    if(l == r) return r;
    int cnt = tr[tr[q].l].cnt - tr[tr[p].l].cnt; // 在 版本为 L R 之间
    int mid = l + r >> 1;
    if(k <= cnt) return query(tr[q].l, tr[p].l, l ,mid, k);
    else return query(tr[q].r, tr[p].r, mid + 1, r, k - cnt); //整个区间的第k小数等于k - 左边去区间的数量
}

void solve(){
    cin >> n >> m;
    for(int i = 1; i <= n; i++){
        cin >> a[i];
        nums.push_back(a[i]);
    }
    sort(nums.begin(), nums.end()); //离散化
    nums.erase(unique(nums.begin(),nums.end()),nums.end());
    
    root[0] = build(0, nums.size() - 1); //创建第 0 个版本的节点位置
    
    for(int i = 1; i <= n; i++) //因为类中没存储区间的值，直接传值供应
        root[i] = insert(root[i - 1], 0,  nums.size() - 1, find(a[i])); 
    
    while(m --){
        int l, r, k;
        cin >> l >> r >> k;
        cout << nums[query(root[r], root[l - 1], 0, nums.size() - 1, k)] << endl;
    }
}

signed main(){
    IOS;
    int _ = 1;
    while(_--){
        solve();
    }
    
}
```

## 八、常见错误
1. **忘记初始化线段树**
2. **将类中的 l , r 理解成下标（实际是左右子树指针）**
3. **建树的返回值是 区间的指针**
4. **在查询时，进入右区间是 cnt < k 因此 k = k - cnt**

## 九、总结
1. 这是一道经典的主席树题目，需要注意的是，主席树维护的是区间内的数字数量，而不是区间内的数字值。
2. 本题还是一个明显的静态问题，可以用以下方法:
  - 划分树 (时空间都是$ N \log N $)
  - 树套树 (时间: $M\log^2N$ , 空间: $N\log N$)
  - 线段树 (时间: $N\log N$ , 空间: $N\log N$)

 