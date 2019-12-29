import random
import pprint

hotels = [4, 8]
depot = [1]

vertices = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
distance = [
    [-1, 2, 42, 36, 24, 18, 15, 22, 30, 13],
    [2, -1, 16, 14, 10, 8, 35, 28, 30, 5],
    [42, 16, -1, 11, 7, 17, 23, 29, 40, 35],
    [36, 14, 11, -1, 10, 18, 24, 32, 38, 21],
    [24, 10, 7, 10, -1, 17, 19, 33, 27, 11],
    [18, 8, 17, 18, 17, -1, 5, 8, 10, 40],
    [15, 35, 23, 24, 19, 5, -1, 37, 8, 3],
    [22, 28, 29, 32, 33, 8, 37, -1, 18, 9],
    [30, 30, 40, 38, 27, 10, 8, 18, -1, 10],
    [12, 5, 35, 21, 11, 40, 3, 9, 10, -1]
]
profits = [0, 2, 5, 0, 4, 3, 2, 0, 3, 10]

populations = []

pop = []
tmax = 200
for i in range(100):
    results = []

    tr = 0
    # tmax = 150

    tmp_vertices = vertices.copy()
    tmp_vertices.remove(0)
    tmp_vertices.remove(3)
    results.append(0)
    results.append(3)
    tr = distance[0][3]
    profit = 0

    while tr <= tmax:
        random_insert_index = random.randint(
            1, len(results) - 2) if len(results) > 2 else 1
        random_vertex_index = random.randint(0, len(tmp_vertices) - 1)

        vertex = tmp_vertices[random_vertex_index]

        tmp_result = results.copy()
        tmp_result.insert(random_insert_index, vertex)
        db = distance[tmp_result[random_insert_index - 1]
                      ][tmp_result[random_insert_index]]
        da = distance[tmp_result[random_insert_index]
                      ][tmp_result[random_insert_index + 1]]

        if tr + da + db <= tmax:
            tr += (da + db)
            tmp_vertices.remove(vertex)
            profit += random_vertex_index
            # print(tmp_result)
            results = tmp_result
        else:
            break

    # print(results, profit)
    pop.append((results, tr, profit))
pop = sorted(pop, key=lambda x: x[2], reverse=True)
populations.append(pop)


for pi in range(1, 50):
    pop = populations[pi-1].copy()

    parent_a = pop[0][0]
    parent_a_profit = pop[0][2]
    parent_b = pop[1][0]
    parent_b_profit = pop[1][2]

    common_genes = list(set(parent_a).intersection(parent_b))
    common_genes.remove(0)
    common_genes.remove(3)

    if len(common_genes) > 1:
        rand_gene = random.randint(0, len(common_genes) - 1)
        cross_index_a = parent_a.index(common_genes[rand_gene])
        cross_index_b = parent_b.index(common_genes[rand_gene])

        # gene_a = random.randint(1, len(parent_a) - 1)
        # gene_b = random.randint(1, len(parent_a) - 1)

        # start_gene = min(gene_a, gene_b)
        # end_gene = max(gene_a, gene_b)

        # child_1 = []
        # child_2 = []
        # child_d = []

        # for i in range(start_gene, end_gene):
        #     child_1.append(parent_a[i])

        # child_2 = [item for item in parent_b if item not in child_1]

        # child_d = child_1 + child_2

        # print(parent_a, parent_b, child_1, child_2,
        #       child_d, (start_gene, end_gene))

        child_a = parent_a[:cross_index_a] + parent_b[cross_index_b:]
        child_b = parent_b[:cross_index_b] + parent_a[cross_index_a:]

        child_a_distance = 0
        child_a_profit = 0

        to_mutate = []

        for i, vertex in enumerate(list(set(child_a))):
            child_a_profit += profits[vertex]

        for i, vertex in enumerate(child_a):
            # child_a_profit += profits[vertex]
            if i == 0:
                continue
            child_a_distance += distance[child_a[i-1]][vertex]

        if child_a_distance <= tmax and (child_a_profit > parent_a_profit or child_a_profit > parent_b_profit):
            # print('nowe dziecko a')
            to_mutate.append(child_a)
            # pop.append((child_a, child_a_distance, child_a_profit))

        child_b_distance = 0
        child_b_profit = 0

        for i, vertex in enumerate(list(set(child_b))):
            child_b_profit += profits[vertex]

        for i, vertex in enumerate(child_b):
            # child_b_profit += profits[vertex]
            if i == 0:
                continue
            child_b_distance += distance[child_b[i-1]][vertex]

        if child_b_distance <= tmax and (child_b_profit > parent_b_profit or child_b_profit > parent_a_profit):
            # print('nowe dziecko b')
            to_mutate.append(child_b)
            pop.append((child_b, child_b_distance, child_b_profit))

        rand_mutate_rate = random.random()
        rand_mutate_index = random.randint(
            0, len(to_mutate)) if to_mutate else -1
        rand_mutate_method = random.randint(0, 1)

        if rand_mutate_rate < 0.1 and rand_mutate_index > -1:
            selected_child = to_mutate[rand_mutate_index].copy()

            # insert another company
            if rand_mutate_method == '0' and len(selected_child) > 2:
                to_select = [for v in vertices v not in selected_child]
                insert_index = random.randint(1, len(selected_child) - 1)
                rand_vertex = random.randint(0, len(to_select))
                selected_child.append(vertices[rand_vertex])
                print("mutation")

                f

    pop = sorted(pop, key=lambda x: x[2], reverse=True)[:10]
    print(pop)
    populations.append(pop)

    # print(parent_a, parent_b)
    # print(child_a, child_b)
    # print(cross_index_a, cross_index_b)
    # print(common_genes)
