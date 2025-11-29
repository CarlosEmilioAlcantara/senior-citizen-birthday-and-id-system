from datetime import datetime
from zoneinfo import ZoneInfo
from flask import current_app
from PIL import Image, ImageDraw, ImageFont
from services.create_address import create_address

def generate_id_card(
    first_name, middle_name, last_name, email, age, birthday, gender,
    house, street, barangay, subdivision, city, province,
    emergency_fname, emergency_mname, emergency_lname,
    emergency_number, id_picture, signature_picture, id
):
    address = create_address(
        house, street, barangay, city, province, subdivision)
    id_back = Image.open(current_app.config["TEMPLATE_FILE_BACK"])
    draw_back = ImageDraw.Draw(id_back)

    now = datetime.now(ZoneInfo("Asia/Manila"))
    timestamp = now.strftime("%m-%d-%Y-%H-%M-%S-%f")
    issue_date = now.strftime("%Y-%m-%d")
    # card_folder = f"{CARDS_FOLDER}/card_{last_name}_{middle_name}_{first_name}-{timestamp}"
    # os.mkdir(card_folder)

    with Image.open(
        current_app.config["TEMPLATE_FILE_FRONT"]
    ).convert("RGBA") as id_front:
        draw_front = ImageDraw.Draw(id_front)
        
        full_name = f"{first_name} {middle_name} {last_name}"
        draw_front.text(
            (200, 610), full_name, fill="black", 
            font=ImageFont.truetype("arial.ttf", size=52))

        draw_front.text(
            (120, 670), address, fill="black", 
            font=ImageFont.truetype("arial.ttf", size=28))

        draw_front.text((
            180, 780), str(age), fill="black", 
            font=ImageFont.truetype("arial.ttf", size=42))
        draw_front.text((
            280, 780), gender, fill="black", 
            font=ImageFont.truetype("arial.ttf", size=42))

        draw_front.text(
            (280, 847), str(birthday), fill="black", 
            font=ImageFont.truetype("arial.ttf", size=42))
        
        with Image.open(id_picture).resize((350, 400)) as senior_picture:
            id_front.paste(senior_picture, (170, 190))

        with Image.open(signature_picture).resize((150, 100)).convert("RGBA") as senior_signature:
            datas = senior_signature.getdata()
            new_data = []

            for item in datas:
                if item[0] > 240 and item[1] > 240 and item[2] > 240:
                    new_data.append((255, 255, 255, 0))
                else:
                    new_data.append(item)
            senior_signature.putdata(new_data)

            id_front.paste(senior_signature, (300, 690), senior_signature)

        # id_front_name = f"card-front_{last_name}_{middle_name}_{first_name}-{timestamp}.png" 
        id_front.save(f"{current_app.config["TEMP_FOLDER"]}/card-front.png")

    with Image.open(
        current_app.config["TEMPLATE_FILE_BACK"]
    ).convert("RGBA") as id_back:
        draw_back = ImageDraw.Draw(id_back)
        
        emergency_name = f"{emergency_fname} {emergency_mname} {emergency_lname}"
        draw_back.text(
            (200, 310), emergency_name, fill="black", 
            font=ImageFont.truetype("arial.ttf", size=48))

        draw_back.text(
            (190, 500), emergency_number, fill="black", 
            font=ImageFont.truetype("arial.ttf", size=48))
        
        # id_back_name = f"card-back_{last_name}_{middle_name}_{first_name}-{timestamp}.png" 
        id_back.save(f"{current_app.config["TEMP_FOLDER"]}/card-back.png")

    # card = query_db(
    #     "SELECT * FROM card_images WHERE senior_id = %s;",
    #     (id,),
    #     True
    # )

    # if card:
    #     if os.path.exists(card["card_folder"]):
    #         shutil.rmtree(card["card_folder"])

    #     modify_db(
    #         ''' UPDATE card_images
    #             SET issue_date = %s, card_front_name = %s , card_back_name = %s, card_folder = %s
    #             WHERE senior_id = %s
    #         ; ''',
    #         (issue_date, f"{card_folder}/{id_front_name}", f"{card_folder}/{id_back_name}", card_folder, id,)
    #     )
    # else:
    #     modify_db(
    #         ''' INSERT INTO card_images(
    #             issue_date, card_front_name, card_back_name, card_folder, senior_id
    #         ) VALUES (
    #             %s, %s, %s, %s, %s
    #         ); ''',
    #         (issue_date, f"{card_folder}/{id_front_name}", f"{card_folder}/{id_back_name}", card_folder, id,)
    #     )