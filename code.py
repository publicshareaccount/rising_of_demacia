# 1. 도시별 건물 배치 (사용자가 자유롭게 수정 가능)
# 제재소:W, 농장:F, 대장간:A, 채석장:Q, 학술원:Acad, 시장:Mkt, 제련소:Ref, 특수:Spec, 듀란드의공방

# 2. 도시 속성 및 인접 관계
city_info = {
    "포스배로우": {"type": "국경", "adj": ["피나라", "하이 실버미어"]},
    "호크스톤": {"type": "산간", "adj": ["하이 실버미어", "유웬데일"]},
    "유웬데일": {"type": "산간", "adj": ["호크스톤", "하이 실버미어", "멜트리지"]},
    "피나라": {"type": "산간", "adj": ["포스배로우", "하이 실버미어", "던홀드"], "prod_boost": 0.0},
    "하이 실버미어": {"type": "산간", "adj": ["포스배로우", "호크스톤", "유웬데일", "피나라", "위대한 도시", "잔델"]},
    "멜트리지": {"type": "국경", "adj": ["유웬데일", "잔델"]},
    "위대한 도시": {"type": "수도", "adj": ["하이 실버미어", "던홀드", "틸번"], "prod_boost": 0.0},
    "잔델": {"type": "중심지", "adj": ["하이 실버미어", "멜트리지", "클라우드필드", "헤이니스", "틸번"]},
    "클라우드필드": {"type": "국경", "adj": ["잔델", "헤이니스", "테르비시아"]},
    "틸번": {"type": "중심지", "adj": ["위대한 도시", "잔델", "브룩할로우"]},
    "헤이니스": {"type": "중심지", "adj": ["잔델", "클라우드필드"]},
    "바스카시아": {"type": "중심지", "adj": ["던홀드", "브룩할로우", "이븐무어"]},
    "브룩할로우": {"type": "중심지", "adj": ["틸번", "바스카시아", "이븐무어", "테르비시아"]},
    "테르비시아": {"type": "국경", "adj": ["브룩할로우", "클라우드필드"]},
    "이븐무어": {"type": "산간", "adj": ["바스카시아", "브룩할로우"]},
    "던홀드": {"type": "국경", "adj": ["피나라", "위대한 도시", "바스카시아"], "prod_boost": 0.0}
}

def run_calculator(city_builds):
    total_wood, total_stone, total_metal, total_petri, total_food = 0, 1, 0, 0, 0 # 공방 1 포함
    
    # 학술원 보너스 미리 계산
    acad_bonus = {t: 0.0 for t in ["국경", "산간", "중심지", "수도"]}
    for city, builds in city_builds.items():
        acad_bonus[city_info[city]["type"]] += builds.count("학술원") * 0.1

    header = f"{'도시명':^12} | {'유형':^6} | {'목재':^8} | {'석재':^8} | {'금속':^8} | {'페트리':^5} | {'식량':^4}"
    print("\n" + "=" * len(header) * 1) 
    print(header)
    print("-" * len(header) * 1)

    mkt, acad, saw, quarry, forge, farm, petri = 0, 0, 0, 0, 0, 0, 0
    for city, builds in city_builds.items():
        info = city_info[city]
        ctype = info["type"]
        
        # 보너스 합산
        mkt_boost = builds.count("시장") * 0.1
        for neighbor in info["adj"]:
            mkt_boost += city_builds[neighbor].count("시장") * 0.1
        
        acad_boost = acad_bonus[ctype]
        special_boost = info.get("prod_boost", 0.0)
        
        hero_boost = 0
        for hero in ["가렌", "갈리오", "뽀삐", "모르가나", "케일", "소나"]:
            if hero in builds:
                hero_boost = 0.5
        
        # 공통 배율 (시장 + 학술원 + 특수도시)
        common_mult = 1.0 + mkt_boost + acad_boost + special_boost + hero_boost
        
        c_wood, c_stone, c_metal, c_petri, c_food = 0, 0, 0, 0, 0
        
        # 건물별 계산
        has_quarry_bonus = False
        has_forge_bonus = False
        has_wood_bonus = False
        farm_bonus_count = 0
        
        for b in builds:
            if b == "제재소":
                c_wood += 150
                saw += 1
        
            elif b == "채석장":
                quarry += 1
                # 산간 보너스: 첫 번째 채석장만 생산량 2배 (멀티플라이어에 +1.0 추가 효과)
                if ctype == "산간" and not has_quarry_bonus:
                    c_stone += 100 * 2
                    has_quarry_bonus = True
                else:
                    c_stone += 100
            
            elif b == "대장간":
                forge += 1
                # 국경 보너스: 첫 번째 대장간만 생산량 2배
                if ctype == "국경" and not has_forge_bonus:
                    c_metal += 50 * 2
                    has_forge_bonus = True
                else:
                    c_metal += 50
            
            elif b == "농장":
                farm += 1
                # 중심지 보너스: 최대 2개 농장 식량 +1
                f_val = 5
                if ctype == "중심지" and farm_bonus_count < 2:
                    c_food += f_val + 1
                    farm_bonus_count += 1
                else:
                    c_food += f_val
            
            elif b == "제련소":
                petri += 1
                c_petri += 3
            elif b == "학술원":
                acad += 1
            elif b == "시장":
                mkt += 1
            
            elif b == "특수": # 공방 등 무조건 지어야 하는 건물 처리
                pass
            
            elif b == "듀란드의공방":
                c_petri += 1
        
        c_wood = c_wood * common_mult + c_wood * (0.25 if ctype == "중심지" else 0)
        c_stone *= common_mult
        c_metal *= common_mult
        c_petri = int(c_petri * common_mult)        
        print(f"{city:10} | {ctype:^4} | {c_wood:8.1f} | {c_stone:8.1f} | {c_metal:8.1f} | {c_petri:6} | {c_food:6}")
        
        total_wood += c_wood
        total_stone += c_stone
        total_metal += c_metal
        total_petri += c_petri
        total_food += c_food

    print("-" * 60)
    print(f"{'총 합계':10} | {'-':^4} | {total_wood:8.1f} | {total_stone:8.1f} | {total_metal:8.1f} | {total_petri:6} | {total_food:6}")
    
    # 최종 비율 체크
    ratio_stone = total_stone / (total_metal if total_metal > 0 else 1)
    ratio_wood = total_wood / (total_metal if total_metal > 0 else 1)
    print(f"\n[생산 비율] 목재 {ratio_wood:.1f} : 석재 {ratio_stone:.1f} : 금속 1.0")
    print(f"제재소: {saw}\t채석장: {quarry}\t대장간: {forge}\t농장: {farm}\t제련소: {petri}\t시장: {mkt}\t학술원: {acad}")

    
city_builds = {
    "포스배로우":    ["대장간"] * 6,                        # 국경
    "호크스톤":      ["채석장"] * 6,                        # 산간
    "피나라":        ["채석장"] * 6 + ["가렌"],             # 산간/보너스
    "하이 실버미어": ["시장"] * 6,                          # 산간
    "유웬데일":      ["채석장"] * 6,             # 산간
    "멜트리지":      ["대장간"] * 6,                        # 국경    
    "위대한 도시":   ["병영"] + ["제련소"] * 5 + ["소나"],  # 수도 (병영)
    "잔델":          ["시장"] * 6,                          # 중심지
    "클라우드필드":  ["대장간"] * 6,                        # 국경
    "헤이니스":      ["제재소"] * 6 + ["뽀삐"],             # 중심지
    "틸번":          ["제재소"] * 5 + ["제련소"] + ["모르가나"],             # 중심지
    "바스카시아":    ["제재소"] * 5 + ["농장"] + ["케일"],  # 중심지
    "브룩할로우":    ["제재소"] * 2 + ["시장"] * 4,         # 중심지
    "테르비시아":    ["대장간"] * 6,                        # 국경
    "이븐무어":      ["채석장"] + ["듀란드의공방"] + ["성소"] + ["왕실무기고"] + ["농장"] * 2, # 산간
    "던홀드":        ["제련소"] * 6 + ["갈리오"],             # 국경/보너스   
}

run_calculator(city_builds)
