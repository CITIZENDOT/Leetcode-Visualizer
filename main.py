import os
import requests
import json


def fetch_problems():
    LEET_CODE_URL = "https://leetcode.com"
    LEET_CODE_GRAPHQL_URL = "https://leetcode.com/graphql"

    response = requests.get("/".join([LEET_CODE_URL, "api/problems/all/"]))
    data = response.json()
    problems = {}

    data = data["stat_status_pairs"]
    for stat in data:
        problems[stat["stat"]["question_id"]] = {
            "title": stat["stat"]["question__title_slug"],
            "total_acs": stat["stat"]["total_acs"],
            "total_submitted": stat["stat"]["total_submitted"],
            "difficulty": stat["difficulty"],
            "tags": [],
        }

    with open("QuestionsData.json", "w") as f:
        json.dump(problems, f)


def fetch_tags_for_problems():
    # Form below URL with: https://meyerweb.com/eric/tools/dencoder/
    HEX_LIKE_URL_1 = """https://leetcode.com/graphql?operationName=questionData&variables={%22titleSlug%22:%22"""
    HEX_LIKE_URL_2 = """%22}&query=query%20questionData(%24titleSlug%3A%20String!)%20%7B%0A%20%20question(titleSlug%3A%20%24titleSlug)%20%7B%0A%20%20%20%20topicTags%20%7B%0A%20%20%20%20%20%20name%0A%20%20%20%20%7D%0A%20%20%7D%0A%7D%0A"""

    with open("QuestionsData.json", "r") as f:
        problems = json.load(f)

    for problemId in problems:
        print(f"\tFetching {problemId}...", end=" ")
        try:
            response = requests.get(
                HEX_LIKE_URL_1 + problems[problemId]["title"] + HEX_LIKE_URL_2
            )
            # problems[i]['tags']
            response = response.json()
            for tag in response["data"]["question"]["topicTags"]:
                problems[problemId]["tags"].append(tag["name"])
            # print(problems[i])
            print("Done.")
        except Exception as e:
            print(f"Failed: {e}")

    with open("src/components/plots/TagsData.json", "w") as f:
        json.dump(problems, f)


def fetch_unique_tags():
    with open("src/components/plots/TagsData.json", "r") as f:
        problems = json.load(f)

    tags = []
    for problemId in problems:
        tags.extend(problems[problemId]["tags"])
    tags = sorted(list(set(tags)))
    with open("src/components/plots/tags.json", "w") as f:
        json.dump(tags, f)


if __name__ == "__main__":
    # print("[+] Fetching Problems...", end=" ")
    # try:
    #     fetch_problems()
    #     print("Done.")
    # except:
    #     print("Failed.")
    #     exit(-1)

    # print(f"[+] Fetching Tags for each problem", end=" ")
    # try:
    #     fetch_tags_for_problems()
    #     print("Done.")
    # except:
    #     print("Failed.")
    #     exit(-1)

    print(f"[+] Forming unique tags...", end=" ")
    try:
        fetch_unique_tags()
        print("Done")
    except:
        print("Failed.")
        exit(-1)
