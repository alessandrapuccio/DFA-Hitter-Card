app_type <- "dev"

# ── Libraries ─────────────────────────────────────────────────────────────────
library(shiny)
library(shinydashboard)
library(shinyWidgets)
library(dplyr)
library(tidyr)
library(RColorBrewer)
library(png)
library(grid)
library(DT)
library(shinyBS)
library(htmltools)
library(RCloudConvert)
library(webshot2)
library(rlang)
library(jsonlite)
library(RODBC)
library(odbc)
library(DBI)

# ── Credentials ───────────────────────────────────────────────────────────────
# Snowflake — used inside fetch_bat_speed.R
snowflake_uid <- "kervais"
snowflake_pwd <- "KErWin116!"

api_key <- "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiZjc3MzY2YWVjZTI2YTE4OTIwODQ5M2FjZjU2MTUwZDMxZjUwZTdlYjA2MTVmNjFkZTdlMTkwNTYyYmVjOTIwNTk0ZjM0MWZlMzY4ZDdlZjUiLCJpYXQiOjE3MDYyOTAxOTQuNDk4OTIzLCJuYmYiOjE3MDYyOTAxOTQuNDk4OTI0LCJleHAiOjQ4NjE5NjM3OTQuNDk0NjI2LCJzdWIiOiI0MjQwNzI4NyIsInNjb3BlcyI6WyJ1c2VyLnJlYWQiLCJ1c2VyLndyaXRlIiwidGFzay5yZWFkIiwidGFzay53cml0ZSIsIndlYmhvb2sucmVhZCIsInByZXNldC5yZWFkIiwidGFzay53cml0ZSIsIndlYmhvb2sud3JpdGUiLCJwcmVzZXQud3JpdGUiXX0.phOxGHYZ54FewkjWi8R4nNjSDxYn60SqCjOk3Xwoa3NcT_UiJaE3vIwT3IBDtIs5JAsTnMLugfI7UHiLKZ8bIWsVVtm08oC-qlUt4yWiEI1wuAcz_LQlECT_JhAH7ad47gyxx-zsj-VGtzJpNUxkB3y2mP1IoN-XedmnJ_hW6MIruM3NTuKQVNog1OJ0LiCK7YvDQ0jOKgFBceXc2sATQB6z_g4h0Rn1wE-xXp0z0clN-5QwL7xiAOjLvy3ggf4Giq7EkHmXf9tOpifobweAqkRzypxB1Pmewsc2WEhe3fQcraUC_Pyy4EEq8tx98PGvsqdHJUiCVcPDxdEZ6HGDxaJxYKn1Ld2x0NvoBAkAybr5n-ExlLE0DX29whaJ4QxcphY03cTPqN-95un0yPOu-AROlK6jFJmC2uEwfudRSsxiXQqEmZzMLJejC6U24JcN6oxwhF6zupqhsBfiEjOgahri5xAvMsylV0X4SE0xUEPRLGyxWy35pIAjAdVKgZcrrEgViNEm5ylLLg6gRH41PgoRkGxTtIh-_VJRZwc82W47jwry7L8PnUypAkkF4yodZVoy7zdx_IxjaMFD2dCKv_m3v5NtgbbTunQEl0R82AmSBApUG7Xe_16wKY3qU2yQxl2kkTPdX3VAAnWJlnfhWuMCy3Ag4Iln1QcK_XdZwwg"

# ── Source: helpers ───────────────────────────────────────────────────────────
source("R/helpers.R")

# ── Source: data fetchers ─────────────────────────────────────────────────────
source("R/data_sources/fetch_norms.R")
source("R/data_sources/fetch_bat_speed.R")
source("R/data_sources/fetch_rolling_wrc.R")
source("R/data_sources/fetch_defense.R")
source("R/data_sources/fetch_catcher.R")

# ── Source: slider config + card builder ──────────────────────────────────────
source("R/slider_config.R")
source("R/hitter_card_data.R")

# ── Source: legacy helpers (pitcher card etc.) ────────────────────────────────
source("helper_hitpit_data_functions.R")

# ── Load workspace data ───────────────────────────────────────────────────────
if (app_type == "prod") {
  load("www/player-pool-hit-workspace.RData")
  load("www/player-pool-pit-workspace.RData")
  load("www/dfa-waiver-workspace.RData")
  source("global.R")
} else if (app_type != "dev") {
  load(file.path("\\\\AVS-FILESVR-01\\Baseball/Analytics Share/seamar-proscout/", "player-pool", "player-pool-hit-workspace.RData"))
  load(file.path("\\\\AVS-FILESVR-01\\Baseball/Analytics Share/seamar-proscout/", "player-pool", "player-pool-pit-workspace.RData"))
  load(file.path("\\\\AVS-FILESVR-01\\Baseball/Analytics Share/seamar-proscout/", "player-pool-dev", "dfa-waiver-workspace.RData"))
}

# ── Pull data ─────────────────────────────────────────────────────────────────
# To swap any of these to an API call later, edit the corresponding file in
# R/data_sources/ — nothing else in the app needs to change.
batspeed_data          <- get_T10BatSped()
norms                  <- get_norms()
final_statcast_defense <- jsonlite::read_json("final_statcast_defense.json", simplifyVector = TRUE)
catcher_raw            <- pull_catcher_defense_statcast()
defensive_overview_c   <- build_defensive_overview_c(catcher_raw)

# ── Build derived config ───────────────────────────────────────────────────────
SLIDER_POPULATION <- build_slider_population(norms, batspeed_data)

# ── Player lists ──────────────────────────────────────────────────────────────
hitters  <- unique(hit_data_acquisition$Name)
pitchers <- c("") # unique(pit_data_acquisition$Name)


# ── Editable stat maps ────────────────────────────────────────────────────────
editable_hitter_stats <- c(
  "Position" = "Position", "B/T" = "BT", "Age" = "Age", "MLS" = "MLS",
  "Salary" = "Salary", "P2" = "P2", "Option" = "Opt", "Outrighted" = "Out",
  "Anchor Value" = "anchor_val", "ML Value" = "ML_val", "Prospect Value" = "PV_val",
  "Proj wRC+" = "Proj_WRC", "Proj wRC+ vL" = "vL", "Proj wRC+ vR" = "vR",
  "SwDec+" = "Proj_SwDec_Plus", "Dmg+" = "Proj_DMG", "Con+" = "Proj_CON",
  "PA" = "PA", "TM wRC+" = "TM_WRC", "wRC+" = "wRC_plus", "BB%" = "BB_percent",
  "K%" = "K_percent", "ZSwing" = "ZSwing", "Chase" = "Chase", "ZWhiff" = "ZWhiff",
  "EV T10%" = "EV_T10", "Bat T10%" = "Bat_T10",
  "DEF Runs" = "def_runs", "Rng+" = "rng_plus", "Arm+" = "arm_plus",
  "BSR Runs" = "bsr_runs", "SB (Made)" = "sb_made", "SB (Attempted)" = "sb_attempted",
  "Present" = "Present", "Future" = "Future", "TE" = "TE", "HIT" = "HIT",
  "CTZ" = "CTZ", "PWR" = "PWR", "RAW" = "RAW", "FLD" = "FLD",
  "ARM" = "ARM", "RUN" = "RUN",
  "Impact Statement" = "Impact_Statement", "Last Report (Date)" = "Last_Report_date",
  "Last Report (Scout)" = "Last_Report_scout", "Additional Comment" = "Additional_Comment"
)

editable_pitcher_stats <- c(
  "Additional Comment" = "Additional_Comment", "NPV" = "NPV", "WAR" = "WAR",
  "Gross" = "Gross", "Surplus" = "Surplus", "MLS" = "MLS", "P2" = "P2",
  "Opt" = "Opt", "Out" = "Out", "Role" = "Role", "IP" = "IP",
  "ERA+" = "ERA_plus", "Proj K%" = "Proj_K_percent", "Proj BB%" = "Proj_BB_percent",
  "Proj IP" = "Proj_IP", "Proj ERA+" = "Proj_ERA_plus", "BB%" = "BB_percent",
  "K%" = "K_percent", "Fx+ v LHB" = "Fx_plus_vL", "Fx+ v RHB" = "Fx_plus_vR",
  "Act v LHB" = "Act_vL", "Act v RHB" = "Act_vR", "Status" = "Status",
  "Level" = "Level", "Salary" = "Salary", "B/T" = "BT", "Age" = "Age",
  "Last Report (Date)" = "Last_Report_date"
)


# ─── UI ────────────────────────────────────────────────────────────────────────
ui <- fluidPage(
  tags$head(
    includeCSS("styling.css"),
    tags$script(src = "hitter-card.js")
  ),

  div(class = "teal-header", "DFA / Waivers Player Card Generation Portal"),

  div(
    style = "display: flex; align-items: stretch; min-height: 100vh;",

    # ── Sidebar ───────────────────────────────────────────────────────────────
    div(
      style = "width: 25%; background-color: #0c2340; padding: 15px; box-sizing: border-box;",
      div(class = "sidebar",
          div(class = "select-panel",
              h4("Select Player(s) to Generate Cards", style = "margin-top: 0;"),
              uiOutput("dynamic_dropdown")
          ),
          br()
      )
    ),

    # ── Main content ──────────────────────────────────────────────────────────
    div(
      style = "width: 75%; padding: 15px; box-sizing: border-box; flex-grow: 1;",
      div(class = "main",
          div(id = "all_player_cards"),
          verbatimTextOutput("selected_value")
      )
    )
  )
)


# ─── Server ────────────────────────────────────────────────────────────────────
server <- function(input, output, session) {

  card_store         <- reactiveValues(cards = list())
  user_values        <- reactiveValues()
  original_data      <- reactiveValues()
  panel_selections   <- reactiveValues()
  in_progress_values <- reactiveValues()
  inserted_players   <- reactiveValues(ids = character(0))


  # ── Sidebar dropdown ────────────────────────────────────────────────────────
  output$dynamic_dropdown <- renderUI({
    pickerInput(
      inputId  = "dropdown",
      label    = NULL,
      choices  = list("Hitters" = sort(hitters), "Pitchers" = sort(pitchers)),
      selected = NULL,
      options  = pickerOptions(
        liveSearch       = TRUE,
        actionsBox       = TRUE,
        deselectAllText  = "Deselect All",
        selectAllText    = NULL,
        noneSelectedText = "Select Player(s)"
      ),
      multiple = TRUE
    )
  })


  # ── Insert / remove player cards reactively ─────────────────────────────────
  observeEvent(input$dropdown, {
    current_players  <- input$dropdown %||% character(0)
    already_inserted <- isolate(inserted_players$ids)

    # Add new players
    new_players <- setdiff(current_players, already_inserted)
    lapply(new_players, function(player) {
      safe_id <- gsub("[^[:alnum:]]", "_", player)

      if (player %in% hitters) {
        div_id    <- paste0("hitter_card_", safe_id)
        orig_data <- get_hitter_raw_data(player)
        original_data[[player]] <- orig_data

        insertUI(
          selector = "#all_player_cards",
          where    = "beforeEnd",
          ui       = div(
            id    = paste0("wrapper_", safe_id),
            style = "display: flex; align-items: flex-start; gap: 16px; margin-bottom: 30px; margin-left: 7px; width: fit-content;",
            div(id = div_id),
            div(style = "min-width: 230px; max-width: 260px;", edit_panel_ui(player, "hitter"))
          )
        )

      } else if (player %in% pitchers) {
        top_info    <- get_pitcher_top_card_info(player)
        scout_info  <- get_pitcher_scouting_info(player)
        grades_info <- get_pitcher_grades_info(player)
        orig_data   <- c(as.list(top_info), as.list(scout_info), as.list(grades_info))
        original_data[[player]] <- orig_data
        user_edits  <- isolate(user_values[[player]]) %||% list()
        card_ui     <- pitcher_card(player, top_info, scout_info, grades_info, user_edits)
        card_store$cards[[player]] <- card_ui

        insertUI(
          selector = "#all_player_cards",
          where    = "beforeEnd",
          ui       = div(
            id    = paste0("wrapper_", safe_id),
            style = "display: flex; align-items: flex-start; gap: 16px; margin-bottom: 30px; margin-left: 7px; width: fit-content;",
            card_ui,
            div(style = "min-width: 230px; max-width: 260px;", edit_panel_ui(player, "pitcher"))
          )
        )
      }

      inserted_players$ids <- c(already_inserted, player)
    })

    # Remove deselected players
    removed_players <- setdiff(already_inserted, current_players)
    lapply(removed_players, function(player) {
      safe_id <- gsub("[^[:alnum:]]", "_", player)
      removeUI(selector = paste0("#wrapper_", safe_id))
    })
    if (length(removed_players) > 0) {
      inserted_players$ids <- setdiff(already_inserted, removed_players)
    }

    # Send hitter cards to React for newly added hitters
    lapply(new_players, function(player) {
      if (player %in% hitters) {
        safe_id   <- gsub("[^[:alnum:]]", "_", player)
        div_id    <- paste0("hitter_card_", safe_id)
        overrides <- isolate(user_values[[player]]) %||% list()
        send_hitter_card(session, player, div_id, overrides)
      }
    })
  })


  # ── Edit panel UI ────────────────────────────────────────────────────────────
  edit_panel_ui <- function(player, type) {
    safe_id <- gsub("[^[:alnum:]]", "_", player)
    stats   <- if (type == "hitter") editable_hitter_stats else editable_pitcher_stats
    selected_stats <- isolate(panel_selections[[safe_id]]) %||% character(0)

    div(
      style = "padding: 10px; background: #f5f5f5; border-radius: 6px;",
      tags$b(player), br(),
      div(
        style = "display: flex; gap: 8px; margin-bottom: 8px;",
        tags$a(href = get_trident_link(player, type), target = "_blank",
               class = "link-blue-btn", style = "width: 120px; padding: 4px 12px; font-size: 14px;",
               "Trident"),
        tags$a(href = get_periscope_link(player, type), target = "_blank",
               class = "link-blue-btn", style = "width: 120px; padding: 3px 12px; font-size: 14px;",
               "Periscope")
      ),
      pickerInput(
        inputId  = paste0("stats_select_", safe_id),
        label    = "Select stats to edit:",
        choices  = stats,
        multiple = TRUE,
        selected = selected_stats,
        options  = list(`actions-box` = TRUE, `live-search` = TRUE)
      ),
      uiOutput(paste0("edit_fields_", safe_id)),
      actionButton(
        inputId = paste0("save_btn_", safe_id),
        label   = "Save Edits",
        class   = "save-btn",
        style   = "width: 100%; margin-top: 6px;"
      ),
      uiOutput(paste0("download_msg_", safe_id))
    )
  }


  # ── Track unsaved in-progress edits ──────────────────────────────────────────
  observe({
    req(input$dropdown)
    lapply(input$dropdown, function(player) {
      safe_id        <- gsub("[^[:alnum:]]", "_", player)
      stats_selected <- input[[paste0("stats_select_", safe_id)]]
      if (!is.null(stats_selected)) {
        lapply(stats_selected, function(stat) {
          input_id <- paste0(safe_id, "_", gsub("[^[:alnum:]]", "_", stat))
          observeEvent(input[[input_id]], {
            in_progress_values[[player]][[stat]] <- input[[input_id]]
          }, ignoreInit = TRUE)
        })
      }
    })
  })


  # ── Persist stat panel selection across redraws ───────────────────────────────
  observeEvent(input$dropdown, {
    lapply(input$dropdown, function(player) {
      safe_id    <- gsub("[^[:alnum:]]", "_", player)
      stat_input <- paste0("stats_select_", safe_id)
      observeEvent(input[[stat_input]], {
        panel_selections[[safe_id]] <- input[[stat_input]]
      }, ignoreInit = TRUE)
    })
  })


  # ── Render edit fields + reset buttons ───────────────────────────────────────
  observe({
    req(input$dropdown)
    lapply(input$dropdown, function(player) {
      safe_id        <- gsub("[^[:alnum:]]", "_", player)
      stats_selected <- input[[paste0("stats_select_", safe_id)]]
      output_name    <- paste0("edit_fields_", safe_id)

      output[[output_name]] <- renderUI({
        req(stats_selected)
        lapply(stats_selected, function(stat) {
          input_id     <- paste0(safe_id, "_", gsub("[^[:alnum:]]", "_", stat))
          reset_btn_id <- paste0("reset_", input_id)
          label_txt    <- if (player %in% hitters) {
            names(editable_hitter_stats)[editable_hitter_stats == stat]
          } else {
            names(editable_pitcher_stats)[editable_pitcher_stats == stat]
          }
          initial_val <- user_values[[player]][[stat]] %||%
            original_data[[player]][[stat]] %||% ""

          tagList(
            div(
              style = "display: flex; align-items: center; margin-bottom: 0px;",
              tags$label(label_txt, style = "margin-right: 8px; margin-bottom:0px;"),
              actionButton(reset_btn_id, "Reset", icon = icon("undo"),
                           style = "margin-left: auto; font-size: 12px; padding: 2px 8px 2px 6px;",
                           class = "btn-reset")
            ),
            textInput(input_id, label = NULL, value = initial_val)
          )
        }) |> tagList()
      })

      # Reset button observers
      lapply(stats_selected, function(stat) {
        input_id     <- paste0(safe_id, "_", gsub("[^[:alnum:]]", "_", stat))
        reset_btn_id <- paste0("reset_", input_id)
        observeEvent(input[[reset_btn_id]], {
          orig_val <- original_data[[player]][[stat]]
          updateTextInput(session, inputId = input_id, value = orig_val)
          user_values[[player]][[stat]] <- orig_val
        }, ignoreInit = TRUE)
      })
    })
  })


  # ── Save edits → resend React card ───────────────────────────────────────────
  observe({
    req(input$dropdown)
    lapply(input$dropdown, function(player) {
      safe_id <- gsub("[^[:alnum:]]", "_", player)
      btn_id  <- paste0("save_btn_", safe_id)

      observeEvent(input[[btn_id]], {
        stats <- input[[paste0("stats_select_", safe_id)]]
        if (is.null(stats)) return()

        # 1. Commit in-progress edits to user_values
        for (stat in stats) {
          val <- in_progress_values[[player]][[stat]]
          if (!is.null(val)) user_values[[player]][[stat]] <- val
        }

        # 2. Sync all open edit panels to show saved values
        lapply(input$dropdown, function(other_player) {
          other_safe_id <- gsub("[^[:alnum:]]", "_", other_player)
          other_stats   <- input[[paste0("stats_select_", other_safe_id)]]
          if (!is.null(other_stats)) {
            for (stat in other_stats) {
              input_id <- paste0(other_safe_id, "_", gsub("[^[:alnum:]]", "_", stat))
              new_val  <- user_values[[other_player]][[stat]] %||%
                original_data[[other_player]][[stat]]
              updateTextInput(session, inputId = input_id, value = new_val)
            }
          }
        })

        # 3. Rebuild JSON with overrides and push updated card to React
        if (player %in% hitters) {
          div_id    <- paste0("hitter_card_", safe_id)
          overrides <- user_values[[player]] %||% list()
          send_hitter_card(session, player, div_id, overrides)
        }
      })
    })
  })


  # ── Trident / Periscope links ─────────────────────────────────────────────────
  get_trident_link <- function(player_name, type) {
    if (type == "hitter") {
      id <- hit_data_acquisition$guidPlayerId[!is.na(hit_data_acquisition$Name) & hit_data_acquisition$Name == player_name]
      return(paste0("https://trident.sodolabs.com/v2/profile/pro-hitter/", id))
    } else if (type == "pitcher") {
      id <- pit_data_acquisition$guidPlayerId[!is.na(pit_data_acquisition$Name) & pit_data_acquisition$Name == player_name]
      return(paste0("https://trident.sodolabs.com/v2/profile/pro-pitcher/", id))
    }
    return("")
  }

  get_periscope_link <- function(player_name, type) {
    if (type == "hitter") {
      id <- hit_data_acquisition$MLBAM_ID[!is.na(hit_data_acquisition$Name) & hit_data_acquisition$Name == player_name]
      return(paste0("https://trident.sodolabs.com/v2/periscope?StartDate=2025-03-18&EndDate=2025-09-28&StatType=1&DisplayedAggregates=1&game_type_desc=Regular%20Season&batter_id=", id, "&DisplayedVisualizations=1,2,3&AggregateBucketType=Pitch%20Group"))
    } else if (type == "pitcher") {
      id     <- pit_data_acquisition$MLBAM_ID[!is.na(pit_data_acquisition$Name) & pit_data_acquisition$Name == player_name]
      throws <- pit_data_acquisition$Throws[!is.na(pit_data_acquisition$Name) & pit_data_acquisition$Name == player_name]
      throws <- ifelse(throws == "L", "Left", "Right")
      return(paste0("https://trident.sodolabs.com/v2/periscope?StartDate=2025-03-18&EndDate=2025-09-28&StatType=2&DisplayedAggregates=2&game_type_desc=Regular%20Season&pitcher_id=", id, "&pitcher_hand=", throws, "&DisplayedVisualizations=2,3,5,4&AggregateBucketType=Pitch%20Type"))
    }
    return("")
  }

}

shinyApp(ui, server)