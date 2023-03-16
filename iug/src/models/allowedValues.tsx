export const allowedLocations=["europe", "asia", "africa", "south_america", "north_america"]

export const allowedStudyFields= ["it","construction_and_infrastructure","geotechnics","machine_and_process_engineering","clean_energy","water_and_sanitation"]

export enum studyFields{
    study_field = "Study field",
    it = "IT",
    construction_and_infrastructure = "Construction and infrastructure",
    geotechnics = "Geotechnics",
    machine_and_process_engineering = "Machine and process engineering",
    clean_energy = "Clean energy",
    water_and_sanitation = "Water and sanitation",
}

export enum locations{
    location = "Location",
    europe = "Europe",
    asia = "Asia",
    africa = "Africa",
    south_america = "South America",
    north_america = "North America",
}

export enum sortByEnum{
    deadline = "Deadline",
    duration = "Duration",
    title = "Title",
}