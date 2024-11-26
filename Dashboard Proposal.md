# Dashboard Proposal

## Dashboard Summary:

This dashboard offers an interactive experience, allowing users to explore driver performance, nationality-specific statistics, and activity trends in racing data. With two main interactive controls—a dropdown menu and a slider—users can dynamically filter and adjust the data, providing a tailored view of various aspects of racing metrics.

## Interactive Components:

### 1. Dropdown (Nationality Filter for Bar Chart 2):

- Users can select specific **NATIONALITIES** of drivers.
- Filters **Bar Chart 2** to show only the average fastest lap times for the chosen nationality.
- Highlights trends and differences in speed across various countries.

### 2. Slider (Year Filter for Bar Chart 1):

- Allows users to adjust the range of years displayed in **Bar Chart 1**.
- Focuses on driver rankings based on **RACE WINS/POINTS** for the selected period.
- Observes how rankings have evolved over time or during particular racing eras.

## Visualization Components

### 1. Bar Chart 1 (Ranking Drivers by Wins/Points):

- Ranks drivers based on **WINS/POINTS**.
- Each bar represents a driver, with its length corresponding to their performance in the selected category.
- Filters data by year range using the **slider**, enabling users to track changes over time.

### 2. Bar Chart 2 (Fastest Laps by Nationality):

- Displays the average **FASTEST LAP TIMES**, grouped by nationality.
- Each bar represents a nationality, with its length showing the average lap time.
- Updates dynamically based on the **dropdown** filter, providing focused insights into speed trends by country.

### 3. Scatter Plot (Race Entries vs. Wins):

- Visualizes the relationship between **RACE ENTRIES** and **RACE WINS** for each driver.
- Each point represents a driver, helping identify patterns in success rates.
- Highlights overperformers and underperformers.

### 4. Pie Chart (Active vs. Non-Active Drivers):

- Shows the percentage of **ACTIVE** versus **RETIRED** drivers.
- Provides a quick snapshot of driver status distribution, revealing the balance between retired and current drivers.

### 5. Line Chart (Years Active vs. Pole Positions by Decade):

- Depicts the relationship between drivers' **YEARS ACTIVE** and **POLE POSITIONS**, grouped by decade.
- **X-Axis:** Years Active
- **Y-Axis:** Pole Positions
- Lines are color-coded by decade, allowing comparisons of trends over time.
- Interactive elements:
  - **Slider:** Filters the chart to focus on specific decades.
  - **Dropdown:** Refines the view by nationality.
- Tooltips display the total **POINTS** for a nationality across all drivers in the selected decade.

## Enhanced User Experience

These interactive elements enable users to:

- Examine a particular nation’s fastest lap times.
- View drivers’ rankings within a specific timeframe.
- Compare drivers with different race histories.

By allowing data customization through the dropdown and slider, users gain a deeper, more relevant understanding of racing metrics. The dashboard adapts to various analytical needs, enhancing usability and engagement.

## Sketch

![Dashboard Sketch](Dashboard%20Sketch.png)
